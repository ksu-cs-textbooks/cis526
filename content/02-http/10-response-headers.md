---
title: "Response Headers"
pre: "10. "
weight: 100
date: 2018-08-24T10:53:26-05:00
---

Response headers take the form of key-value pairs, separated by colons `:` and terminated with a CRLF (a carriage return and line feed character), just like Request Headers (both are types of Message Headers).  For example, this header:

```
Expires: Wed, 12 Jun 2019 08:00:00 CST
``` 

indicates to the browser that this content will expire June 12, 2019 at 8AM Central Standard Time.  The browser can use this value when populating its cache, allowing it to use the cached version until the expiration time, reducing the need to make requests.

Note that response headers are a subset of _message headers_ that apply specifically to requests.  As we've seen there are also message headers that apply only to HTTP requests, and some that apply to both.

As HTTP is intended as an extensible protocol, there are a _lot_ of potential headers.  IANA maintains the [offical list of message headers](https://www.iana.org/assignments/message-headers/message-headers.xhtml) as well as [a list of proposed message headers](https://www.iana.org/assignments/message-headers/message-headers.xhtml).  You can also find a categorized list in the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

While there are many possible response headers, some of the more commonly used are:

__Allow__ Lists the HTTP Methods that can be used with the server

__Content-Length__ The length of the response body sent, in octets 

__Content-Type__ The MIME type of the response body 

__Content-Encoding__ The encoding method of the response body

__Location__ Used in conjunction with redirects (a 301 or 302 status code) to indicate where the user-agent should be redirected to.

__Server__ Contains information about the server handling the request.  

__Set-Cookie__ Sets a cookie for this server on the client. The client will send back the cookie on subsequent requests using the `Cookie` header.

We'll make use of these headers as we start writing web servers.