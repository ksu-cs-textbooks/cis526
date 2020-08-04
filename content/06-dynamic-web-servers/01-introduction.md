---
title: "Introduction"
pre: "1. "
weight: 10
date: 2018-08-24T10:53:26-05:00
---

While the first generation of webservers was used to serve static content (i.e. files), it was not long before developers began to realize that a lot more potential existed in the technologies of the web.  A key realization here is that the resources served by the web server _don't need to exist_ to be served. 

Consider the directory listing from the previous chapter. It is _not_ based on an existing file, but rather is _dynamically created_ when requested by querying the file system of the server. This brings one clear benefit - if we add files to the directory, the next time we request the listing they will be included. 

![Request-Response Pattern]({{<static "images/6.1.1.png">}})

Thus, we can create resources _dynamically_ in response to a request.  This is the core concept of a _dynamic web server_, which really means any kind of web server that generates at least some of its content dynamically.  In this chapter, we will explore this class of web server.