---
title: "Introduction"
pre: "1. "
weight: 10
date: 2018-08-24T10:53:26-05:00
---

Of course, what made dynamic web servers interesting was that they could provide content built _dynamically_.  In this approach, the HTML the server sends as a response does not need to be stored on the server as a HTML file, rather it can be constructed when a request is made.

That said, most web applications still need a persistent storage mechanism to use in dynamically creating those pages.  If we're dealing with a forum, we need to store the text for the posts.  If we're running an e-commerce site, we aren't making up products, we're selling those already in our inventory.

Thus, we need some kind of storage mechanism to hold the information we need to create our dynamic pages.  We could use a variable and hold those values in memory, but we'd also need a mechanism to _persist_ those values when our server restarts (as the contents of volatile memory are lost when power is no longer supplied to RAM).