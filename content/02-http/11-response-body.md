---
title: "Response Body"
pre: "11. "
weight: 110
date: 2018-08-24T10:53:26-05:00
---
After the response headers and an extra CRLF (carriage return and line feed) is the response body.  

The body is typically text (for HTML, CSS, JavaScript, and other text files) or binary data (for images, video, and other file types). 

Setting the `Content-Type` and `Content-Length` headers lets the web client know what kind of data, and how much of it, should be expected.  If these headers are not supplied in the response, the browser may treat the body as a blob of binary data, and only offer to save it.