---
title: "HTTP Authentication"
pre: "2. "
weight: 20
date: 2018-08-24T10:53:26-05:00
---

The recognition of a need for authentication is not new to the web - it's been there since the earliest standards.  In fact, the original URL specification included an optional username and password as part of its format (specified as `[username]:[password]@` between the protocol and host).  I.e. to make a HTTP authenticated request against the CS departmental server you might use:

```
https://willie:purpleandwhite@cs.ksu.edu/
```

However, the use of authentication URLS is now highly discouraged and has been stripped from most browsers, as it is considered a security risk.  Instead, if you are using [HTTP-based authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) the server needs to issue a challenge **401 Unauthorized** response, along with a `WWW-Authenticate` header specifying the challenge.  This will prompt the browser to display a username/password form and will re-submit the request with the credentials using an `Authorization` header.  The process looks something like this:

![The HTTP Authentication process]({{<static "images/9.2.1.png">}})

As you can see, when the client makes a request that requires authentication, the server issues a **401 Unauthorized** status code, along with an `WWW-Authenticate` header specifying the authentication scheme.  This prompts the browser to request the user credintials via a dialog (much like the one created by the JavaScript functions `alert()`, `confirm()`, and `prompt()`).  If the user supplies credentials, the request is re-sent, with those credentials included in an `Authentication` header.  The server then decides, based on the credentials, if it will allow the request (typically a **200** response), or refuse (a **403 Unauthorized** response).

The `WWW-Authenticate` header looks like:

```
WWW-Authenticate: [type] realm=[realm]
```

Where `[type]` is the authentication scheme (`Basic` being the most common), and `realm` describing the protected part of the server.

In the Basic authentication scheme, the content of the `Authorization` header is the string `[username]:[password]` encoded in [base64](https://en.wikipedia.org/wiki/Base64), where `[username]` is the users' username, and `[password]` is thier password.

{{% notice warning %}}
Base64 encoding is easy to undo, so you should only use HTTP Basic Authentication with the `https` protocol, which encrypts the request headers.  Otherwise, anyone along the path the user's request travels can capture and decrypt the user's credentials.
{{% /notice %}}

The standard also defines other authorization schemes, but none are widely used today.  Instead, most web developers have opted to build authentication directly into their web application. We'll discuss several of the most common approaches next.