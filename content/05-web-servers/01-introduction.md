---
title: "Introduction"
pre: "1. "
weight: 10
date: 2018-08-24T10:53:26-05:00
---

The first web servers were developed to fulfill a simple role - they responded to requests for HTML documents that were (hopefully) located in their physical storage by streaming the contents of those documents to the client.

![Request-Response Pattern]({{<static "images/5.0.1.png">}})

This is embodied in our request-response pattern.  The client requests a resource (such as a HTML document), and receives either a status 200 response (containing the document), or an error status code explaining why it couldn't be retrieved.