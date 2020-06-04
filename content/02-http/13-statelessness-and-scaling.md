---
title: "Statelessness and Scaling"
pre: "13. "
weight: 130
date: 2018-08-24T10:53:26-05:00
---

One final point to make about Hyper-Text Transfer Protocol.  It is a _stateless_ protocol.  What this means is that the server does not need to keep track of previous requests - each request is treated as though it was the first time a request has been made.

This approach is important for several reasons.  One, if a server must keep track of previous requests, the amount of memory required would grow quickly, especially for popular web sites.  We could very quickly grow past the memory capacity of the server hardware, causing the webserver to crash.

![Scaling strategies]({{<static "images/2.12.1.png">}})

A second important reason is how we _scale_ web applications to handle more visitors.  We can do _vertical scaling_ - increasing the power of the server hardware - or _horizontal scaling_ - adding additional servers to handle incoming requests.  Not surprisingly, the second option is the most cost-effective.  But for it to work, requests need to be handed quickly to the first available server - there is no room for making sure a subsequent request is routed to the same server.  
