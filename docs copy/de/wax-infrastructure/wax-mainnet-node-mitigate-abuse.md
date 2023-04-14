---
title: API Missbrauch eindämmen
nav_order: 147
layout: default
parent: WAX Infrastructure/APIs
lang-ref: How to Mitigate API abuse on a WAX Load Balancer
lang: es-DE
---

Auch wenn Sie einen WAX Guild-Dienst anbieten, der von einem leistungsstarken HAProxy unterstützt wird, kann dieser Dienst von gierigen oder böswilligen Benutzern ausgenutzt werden.

In diesem Leitfaden wird die Konfiguration von HAProxy-Antwortrichtlinien erläutert, um diese Art von Bedrohungen einzudämmen.

# Wie man den API-Missbrauch auf einem WAX Load Balancer eindämmt

Im HAProxy-Beispiel des vorherigen Leitfadens werden Sie bemerkt haben, dass eine `maxconn'-Variable sowohl im **globalen** Abschnitt als auch im **Backend** Abschnitt konfiguriert wurde.

Maxconn" ist eine harte Grenze, die den Aufbau von mehr als der angegebenen Anzahl von Verbindungen zum API-Dienst verhindert, wenn dieser Schwellenwert erreicht ist.

HAProxy verfügt über eine elegantere Methode zur Erkennung und Begrenzung von Missbrauch. Zwei dieser Mechanismen werden in diesem Artikel besprochen.

## Sliding Window Rate Limiting

Auch bekannt als die Implementierung von **Deny-Stick-Listen** sind eine Möglichkeit, die Anzahl der Anfragen zu begrenzen, die ein Benutzer für eine bestimmte Quell-IP-Adresse über einen bestimmten Zeitraum an Ihre APIs stellen kann.

In diesem Konfigurationsbeispiel ist eine Begrenzung auf **200 API-Anfragen** pro Quell-IP-Adresse über einen **Zeitraum von 5 Sekunden** zulässig. Diese Zeitspanne ist ein gleitendes Fenster. Wird der Schwellenwert erreicht, wird der Benutzer abgewiesen und erhält eine Fehlermeldung 429.

Der HTTP-Fehler 429 ist ein HTTP-Antwortstatuscode, der anzeigt, dass **_die Client-Anwendung ihr Ratenlimit**_ oder die Anzahl der Anfragen, die sie in einem bestimmten Zeitraum senden kann, überschritten hat.**

![image](https://user-images.githubusercontent.com/12730423/201574327-6544b9f4-209f-4da0-b833-00e76afe6531.png)

Gehen Sie wie folgt vor, um die einzelnen Abschnitte in der Datei "haproxy.cfg" zu konfigurieren

```
> sudo nano /etc/haproxy/haproxy.cfg
```

**frontend**

```
frontend http-in  
    http-request track-sc0 src table wax_api_servers
```
This configuration creates a specific table in HAProxy.

**backend**
```
backend wax_api_servers  
    stick-table type ip size 50k expire 30s store http_req_rate(5s)  
    http-request deny deny_status 429 if { sc_http_req_rate(0) gt 200 }
```

Diese Konfiguration wendet die Richtlinie auf das spezifische Backend an.

Speichern und beenden Sie `haproxy.cfg`, überprüfen Sie Ihre Konfiguration und starten Sie den Dienst neu.

```
> haproxy -c -V -f /etc/haproxy/haproxy.cfg  
Konfigurationsdatei ist gültig

> sudo service haproxy restart

> sudo service haproxy status  
Active: active (running)
```
Wenn Sie das Statistik-Dashboard mit Prometheus verwenden, können Sie die Anzahl der API-Benutzer sehen, die diesen Schwellenwert erreichen und 429 abgelehnt werden.  **-HTTP 4xx Antworten:**

![image](https://user-images.githubusercontent.com/12730423/201574775-18ee6c3d-0a3e-4148-960b-dc2059f8bacb.png)

## Tarpit

Das Beispiel der Stick-Liste **deny** gibt potenziellen Missbrauchern eine unmittelbare Benachrichtigung, dass sie abgewiesen wurden, was oft innerhalb von Millisekunden zu einem erneuten Versuch führt. Die Antwortrichtlinie von HAProxy Tarpit nimmt die Verbindung eines Clients an, wartet dann aber eine vordefinierte Zeit (in diesem Beispiel 10 Sekunden), bevor sie eine Verweigerungsantwort zurückgibt. Dies kann die Ressourcen des böswilligen Benutzers binden und ihn daran hindern, Ihre API weiter zu attackieren.

Im Wesentlichen wird Tarpit in der Stick-List-Richtlinie konfiguriert, indem **deny** durch **tarpit** ersetzt wird.

Gehen Sie wie folgt vor, um jeden Abschnitt in der "haproxy.cfg" zu konfigurieren und die vorherige Richtlinie zu ändern.

```
> sudo nano /etc/haproxy/haproxy.cfg
```

**backend**

```
backend wax_api_servers  
    stick-table type ip size 50k expire 30s store http_req_rate(5s)  
    http-request tarpit deny_status 429 if { sc_http_req_rate(0) gt 200 }  
    timeout tarpit 10s
```

Diese Konfiguration wendet die Richtlinie auf das spezifische Backend an und setzt die Verzögerung auf 10 Sekunden.

Speichern und beenden Sie `haproxy.cfg`, überprüfen Sie Ihre Konfiguration und starten Sie den Dienst neu.

```
> haproxy -c -V -f /etc/haproxy/haproxy.cfg  
Konfigurationsdatei ist gültig

> sudo service haproxy restart> sudo service haproxy status  
Active: active (running)
```

---

Diese **WAX Developer Technical Guides** wurden unter Verwendung von Quellmaterial aus der [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home) erstellt.

Stellen Sie Ihre Fragen im [EOSphere Telegram](https://t.me/eosphere_io)
