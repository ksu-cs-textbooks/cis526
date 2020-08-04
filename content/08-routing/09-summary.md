---
title: "Summary"
pre: "9. "
weight: 90
date: 2018-08-24T10:53:26-05:00
---

In this chapter, we expored the idea of _routes_, a mechanism for mapping a request to the appropriate _endpoint_ function to generate a response.  Routes typically consist of both the request URL _and_ the request method.  RESTful routes provide a common strategy for implementing CRUD methods for a server-generated resource; any programmer familiar with REST will quickly be able to suss out the appropriate route.  

We also explored _routers_ are objects that make routing more managable to implement.  These allow you to define a route and tie it to an endpoint function used to generate the result.  Most will also capture wildcards in the route, and supply htose to the endpoint function in some form.  We breifly looked at the [Express](http://expressjs.com/) framework, a Node framework that adds a router to the vanilla Node [http.Server](https://nodejs.org/api/http.html#http_class_http_server) class. 

Finally, we discussed using routes to serve other _programs_ instead of users with APIs and WebHooks.