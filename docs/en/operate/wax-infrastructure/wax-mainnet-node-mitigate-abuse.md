---
title: How to Mitigate API abuse on a WAX Load Balancer
order: 147
---

Even though you may be providing a WAX Guild level of service fronted by a high performing HAProxy, this service is still open to be exploited by greedy or malicious users.

This guide will walk through configuring HAProxy response policies to mitigate these types of threats.

# How to Mitigate API abuse on a WAX Load Balancer

In the previous guide's HAProxy example you will have noticed that a  `maxconn`  variable was configured in the  **global**  section as well as in the  **backend**  section.

`maxconn`  is a hard limit that will stop any more than the specified connections from being setup to the API service when this threshold is met, however it is indiscriminate and will stop good actors along with the API abusers.

HAProxy has a more elegant way of identifying and limiting abuse, two of these mechanisms will be discussed in this article.

## Sliding Window Rate Limiting

Also known as implementing  **deny stick lists**  are a way to limit the number of requests a user for a specific source IP address can make of your API’s over a period of time.

In this configuration example there is a limit of  **200 API requests**  per source IP address allowed over a  **period of 5 seconds**. This period of time is a sliding window. If the threshold is met the user is denied and receives a 429 error.

_HTTP Error 429 is an HTTP response status code that indicates_ **_the client application has surpassed its rate limit_**_, or number of requests they can send in a given period of time._

![image](https://user-images.githubusercontent.com/12730423/201574327-6544b9f4-209f-4da0-b833-00e76afe6531.png)

Follow the below to configure each section in the  `haproxy.cfg`

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

This configuration applies the policy to the specific backend.

Save and exit  `haproxy.cfg`, check your configuration and restart the service.

```
> haproxy -c -V -f /etc/haproxy/haproxy.cfg  
Configuration file is valid

> sudo service haproxy restart

> sudo service haproxy status  
Active: active (running)
```
If you are using the Statistics dashboard with Prometheus you can see the number of API users hitting this threshold and being 429 denied.  **-HTTP 4xx responses:**

![image](https://user-images.githubusercontent.com/12730423/201574775-18ee6c3d-0a3e-4148-960b-dc2059f8bacb.png)

## Tarpit

The stick list  **deny**  example gives potential abusers a immediate notification that they have been denied, often prompting an retry within milliseconds. HAProxy Tarpit’s response policy accepts a client’s connection, but then waits a predefined time (10 seconds in this example) before returning a deny response. This can tie up the malicious user’s resources limiting their ability to continue hammering your API.

Essentially tarpit is configured in the stick-list policy by replacing  **deny**  with  **tarpit**

Follow the below to configure each section in the  `haproxy.cfg`  to amend the previous policy.

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

This configuration applies the policy to the specific backend and sets the delay to 10 seconds.

Save and exit  `haproxy.cfg`, check your configuration and restart the service.

```
> haproxy -c -V -f /etc/haproxy/haproxy.cfg  
Configuration file is valid

> sudo service haproxy restart> sudo service haproxy status  
Active: active (running)
```

---

These **WAX Developer Technical Guides** are created using source material from the [EOSphere WAX Technical How To Series](https://medium.com/eosphere/wax-technical-how-to/home)

Be sure to ask any questions in the  [EOSphere Telegram](https://t.me/eosphere_io)
