---
title: Zuverlässigen WAX-Load-Balancer einrichten
nav_order: 146
layout: default
parent: WAX Infrastructure/APIs
lang-ref: How to Set Up a Reliable WAX Load Balancer
lang: es-DE
---

Unsere bisherigen Leitfäden haben sich in erster Linie auf die Erstellung und den Betrieb von WAX-Software konzentriert, aber das ist nur ein Teil des Bildes, wenn es um die Bereitstellung zuverlässiger Dienste für das WAX-Ökosystem geht.

Dieser Leitfaden führt Sie durch den Prozess der Erstellung und des Betriebs eines Load Balancer-Dienstes, der die Sicherheits- und Leistungsanforderungen von WAX zuverlässig erfüllt.

# Wie man einen zuverlässigen WAX Load Balancer einrichtet

Die Skalierung Ihrer WAX Protocol Network API-Services auf Millionen von Anfragen pro Tag kann eine Herausforderung darstellen, wenn Sie die Last- und Verfügbarkeitsanforderungen für die Bereitstellung von Services auf Gildebene nicht im Voraus geplant haben.

Die Implementierung von Load Balancern auf der öffentlich zugänglichen Seite Ihrer Infrastruktur ist eine fantastische Möglichkeit, Ihr API-Serviceangebot zuverlässig zu skalieren.

Ein Load Balancer wird in erster Linie aus den folgenden Gründen implementiert:

- Ausgleich von Benutzeranfragen über mehrere Backend-Server
- Entlastung von SSL-Handshake und Verschlüsselung/Entschlüsselung
- Entlastung der Backend-Server bei der Verwaltung von Anwendungs- und Netzwerk-Benutzersitzungen
- Schaffung eines Sicherheitsabgrenzungspunktes für Ihr WAX-Dienstangebot für Benutzer im Internet

[EOSphere](https://eosphere.io/) hat die Software [HAProxy](https://www.haproxy.org/) mit großem Erfolg für unsere Load Balancer-Anforderungen eingesetzt.

_HAProxy ist eine kostenlose,_ **_sehr_** _schnelle und zuverlässige Lösung, die_ [__hohe Verfügbarkeit_](http://en.wikipedia.org/wiki/High_availability)_,_ [_Lastausgleich_](http://en.wikipedia.org/wiki/Load_balancer)_ und Proxying für TCP- und HTTP-basierte Anwendungen bietet. Sie eignet sich besonders für sehr stark frequentierte Websites und betreibt eine ganze Reihe der weltweit meistbesuchten Websites. Im Laufe der Jahre hat er sich zum De-facto-Standard unter den Open-Source-Load-Balancern entwickelt, wird inzwischen mit den meisten gängigen Linux-Distributionen ausgeliefert und wird häufig standardmäßig in Cloud-Plattformen eingesetzt.

Dieser Leitfaden enthält ein Beispiel für den Aufbau und die Konfiguration von HAProxy für die Verwendung im WAX Protocol Network, das auf unseren eigenen Erfahrungen und Empfehlungen beruht.

# Anforderungen

**Hardware (der Betrieb in einer virtuellen Umgebung funktioniert hervorragend)  
**_Hinweis: Je nach Verkehrsaufkommen müssen Sie ggf. aufstocken_

-   2 Core+ CPU
-   32GB+ Disk
-   1GB+ RAM
-   Public Network Interface
-   Private Network Interface

**Betriebssystem**

-   [Ubuntu](https://ubuntu.com/)  18.04
-   [Ubuntu](https://ubuntu.com/)  20.04  **_(Recommended)_**
-   [Linux 2.4](http://www.kernel.org/)  on x86, x86_64, Alpha, Sparc, MIPS, PARISC
-   [Linux 2.6–5.x](http://www.kernel.org/)  on x86, x86_64, ARM, AARCH64, MIPS, Sparc, PPC64
-   [Solaris 8/9](http://www.sun.com/software/solaris/)  on UltraSPARC 2 and 3
-   [Solaris 10](http://www.sun.com/software/solaris/)  on Opteron and UltraSPARC
-   [FreeBSD 4.10 — current](http://www.freebsd.org/)  on x86
-   [OpenBSD 3.1 to -current](http://www.openbsd.org/)  on i386, amd64, macppc, alpha, sparc64 and VAX (check the ports)
-   [AIX 5.1–5.3](http://www-03.ibm.com/systems/power/software/aix/about.html)  on Power™ architecture

**Internet**

- Moderne Breitband-/Glasfaserverbindung (100Mb/s synchron und mehr)
- Statische öffentliche IP-Adresse (die entweder auf dieser Node endet oder mit NAT weitergeleitet wird)
- Domänenname und DNS-Anbieter
- SSL-Zertifikat

# Installation der Software

In diesem Beispiel installieren wir HAProxy aus einem von der Community empfohlenen Personal Package Archive (PPA), das von [Vincent Berant](https://launchpad.net/~vbernat) verwaltet wird, und verwenden den neuesten HAProxy-LTS-Zweig [v2.6.0](https://github.com/haproxy/haproxy/releases/tag/v2.6.0) (unterstützt bis Q2 2027), Stand Oktober 2022.

Dieser Build hat native Unterstützung für **Prometheus**, die es Ihnen ermöglicht, Metriken anzuzeigen und zu exportieren, und ermöglicht coole Beobachtbarkeit sowie Logging und Tracing.

**Installation**

Gehen Sie wie folgt vor, um HAProxy v2.6.0 zu installieren:

```
> sudo apt install --no-install-recommends software-properties-common

> sudo add-apt-repository ppa:vbernat/haproxy-2.6

> sudo apt update> apt install haproxy=2.6.\*
```

Sie können die installierte Version wie unten beschrieben überprüfen und sicherstellen, dass Sie die Prometheus-Unterstützung sehen können:

```
> haproxy -vv

Mit Prometheus-Exporter
```

# Konfiguration

Jetzt, wo Sie eine neue HAProxy-Installation haben, können wir die Instanz für die Produktion konfigurieren. In diesem Beispiel besteht das Ziel darin:

- Lastverteilung der eingehenden Anfragen an zwei WAX-API-"Nodeos"-Server
- SSL-Verschlüsselung/Entschlüsselung der HTTPS-Sitzungen auszulagern
- Beobachtung der HAProxy-Metriken mit Hilfe des Prometheus-Dienstes

Dieses Beispiel verfügt über eine **öffentliche Internetschnittstelle**, die den Kunden zugewandt ist, sowie über eine separate **private LAN-Schnittstelle**, auf der die Server gehostet werden.

Die gesamte HAProxy-Konfiguration befindet sich in der Datei `haproxy.cfg`. Die Konfiguration ist in 4 Abschnitte unterteilt.

```
global      
# globale/generelle einstellungen 

defaults      
# standardeinstellungen

frontend      
# Nimmt eingehende Verbindungen entgegen

backend      
# Server zur Verarbeitung der Anfragen
```

Es gibt eine Standard-"haproxy.cfg", von der Sie eine Kopie für zukünftige Zwecke erstellen können:

```
> sudo mv /etc/haproxy/haproxy.cfg /etc/haproxy/old_haproxy.cfg
```

Gehen Sie wie folgt vor, um jeden Abschnitt in der neuen `haproxy.cfg` zu konfigurieren:

```
> sudo nano /etc/haproxy/haproxy.cfg
```

**global**

```
global  
        log /dev/log    local0  
        log /dev/log    local1 notice  
        maxconn 100000  
        chroot /var/lib/haproxy  
        stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners  
        stats timeout 30s  
        tune.ssl.default-dh-param 2048  
        user haproxy  
        group haproxy  
        daemon
        
        # Default SSL material locations  
        ca-base /etc/ssl/certs  
        crt-base /etc/ssl/private
        
        # Default ciphers to use on SSL-enabled listening sockets.  
        ssl-default-bind-ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:RSA+AESGCM:RSA+AES:!aNULL:!MD5:!DSS  
        ssl-default-bind-options no-sslv3 no-tlsv10 no-tlsv11
```

**defaults**

```
defaults  
        log     global  
        mode    http  
        http-reuse always  
        option  httplog  
        option  dontlognull  
        timeout connect 10000  
        timeout client  25000  
        timeout server  25000  
        errorfile 400 /etc/haproxy/errors/400.http  
        errorfile 403 /etc/haproxy/errors/403.http  
        errorfile 408 /etc/haproxy/errors/408.http  
        errorfile 500 /etc/haproxy/errors/500.http  
        errorfile 502 /etc/haproxy/errors/502.http  
        errorfile 503 /etc/haproxy/errors/503.http  
        errorfile 504 /etc/haproxy/errors/504.http
```

**frontend**

In diesem Abschnitt aktivieren Sie Ihre öffentliche Internetschnittstelle, um eingehende Client-Anfragen zu akzeptieren. Außerdem binden Sie Ihr SSL-Zertifikat, um HTTPS akzeptieren zu können und SSL-Offloading bereitzustellen.

```
frontend http-in  
    bind <PUBLIC IP ADDRESS>:80  
    bind <PUBLIC IP ADDRESS>:443 ssl crt /etc/ssl/certs/eosphere-local-cert-key-2021.pem alpn h2,http/1.1  
    http-response set-header Access-Control-Allow-Origin "*"  
    http-response set-header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization, JSNLog-RequestId, activityId, applicationId, applicationUserId, channelId, senderId, sessionId"
```

EOSphere verwendet die von [Comodo](https://comodosslstore.com/) zur Verfügung gestellten Wildcard-SSL-Zertifikate. Ihre Ergebnisse können variieren, aber der Aufbau der Datei "eosphere-local-cert-key-2021.pem" in diesem Beispiel ist wie folgt und in der folgenden Reihenfolge:

```
your_company.key

your_company.crt

SectigoRSADomainValidationSecureServerCA.crt

USERTrustRSAAAACA.crt
```

Kopieren Sie den Text aus den obigen Dateien in die neue Datei und speichern Sie diese Datei unter `/etc/ssl/certs/<yourcompany_key>.pem`.

Zusätzlich zu einer typischen Frontend-Konfiguration wird in diesem Beispiel eine Zugriffsliste verwendet, um den Verkehr auf der Grundlage der angeforderten Zieldomäne zu erkennen. Dies ist praktisch, wenn Sie andere API-Dienste mit ähnlichen Backend-Anfragen, aber mit unterschiedlichen Domänennamen unterstützen würden. Zum Beispiel WAX Mainnet (wax.eosphere.io) und WAX Testnet (wax-testnet.eosphere.io).

Fügen Sie dem Abschnitt `frontend http-in` folgendes hinzu, um die Zugriffslisten abzudecken:

```
acl wax_acl hdr(host) -i wax.eosphere.io

use_backend wax_api_servers if wax_acl { path_beg /v1/chain }  
use_backend wax_api_servers if wax_acl { path_beg /v1/node/get_supported_apis }
```

Dieses Beispiel passt für Anfragen an wax.eosphere.io

Da unsere Backend-Server keine Historie unterstützen, haben wir `/v1/history` nicht weitergeleitet. Sie sehen nun die granulare Kontrolle, die HAProxy bieten kann.
**backend**

Hier werden die beiden WAX-"Nodeos"-Server angegeben und der Lastausgleichsalgorithmus wird in diesem Fall als Round Robin konfiguriert:

```
backend wax_api_servers  
    balance roundrobin  
    default-server check maxconn 3000  
    server wax-pn-1 <PRIVATE LAN IP>:8888 cookie server1  
    server wax-pn-2 <PRIVATE LAN IP>:8888 cookie server2
```

**Prometheus**

Aktivieren Sie den Prometheus-Dienst mit dem folgenden zusätzlichen Front-End-Abschnitt:

```
frontend stats  
        mode http  
        bind <PRIVATE IP>:8404  
        http-request use-service prometheus-exporter if { path /metrics }  
        stats enable  
        stats uri /stats  
        stats refresh 10s
```

# Speichern und Starten

Nachdem die Datei `haproxy.cfg` erfolgreich konfiguriert wurde, speichern Sie und beenden Sie das Programm.

Prüfen Sie die Konfiguration auf Fehler:

```
> haproxy -c -V -f /etc/haproxy/haproxy.cfg  
Configuration file is valid
```

HAProxy Service neustarten

```
> sudo service haproxy restart> sudo service haproxy status  
Active: active (running)
```

Der HAProxy-Server akzeptiert nun Anfragen an das von Prometheus betriebene Statistik-Dashboard, auf dem Sie den Betrieb Ihres neu eingerichteten WAX HAProxy Load Balancers beobachten können.

![](https://miro.medium.com/max/700/1*jCwHJe48TawgDX3YpDyosQ.png)

HAProxy Statistik Dashboard

```
http://<PRIVATE IP>:8404/stats
```
Und natürlich testen Sie eine externe Anfrage an Ihre WAX `nodeos` Load Balanced Server, nachdem Sie Ihren DNS A-Eintrag auf die konfigurierte öffentliche IP-Adresse von HAProxy gerichtet haben.  Da wir eine Zugriffsliste für interessante Anfragen konfiguriert haben, muss die Testanfrage über den DNS-Namen und nicht über eine IP-Adresse erfolgen.

```
https://<Your Company DNS_Name>/v1/chain/get_info
```

---

Diese **WAX Developer Technical Guides** wurden unter Verwendung von Quellmaterial aus der [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home) erstellt.

Stellen Sie Ihre Fragen im [EOSphere Telegram](https://t.me/eosphere_io)
