---
title: "JSON Web Tokens"
pre: "8. "
weight: 80
date: 2018-08-24T10:53:26-05:00
---

A common thread across single-sign-on approaches is the issuing of some kind of ticket or certificate to identify the signed-in user.  This is often stored within a cookie (which means it can be used to persist a connection with a web app).  However, as the web matured, a more robust identity token became a standard: the JSON Web Token (JWT).

A JSON Web Token (JWT) consists of three parts: 

* A header with metadata 
* A payload consisting of the data needed to identify the user 
* A cryptographic signature verifying the payload and header

The JWT puts the user information directly into a token that is served by the authentication server.  So if we want to identify a user by email, their email is in the payload.  The header provides information like when the JWT will expire, and what cryptographic algorithm was used to generate the signature.  And the signature was created using the specified cryptographic algorithm on the header and payload.  This signature is what gives a JWT its robustness; when used correctly makes it impossible to modify the payload without the tampering being evident.

How trust is established is based on the cryptographic function, which uses a public and private key pair (much like TLS).  The hash is _created_ with the private key on the authentication server on a successful login.  It can be _decoded_ by an application using the _public_ key. The decoded data should match that of the header and payload _exactly_.  If it does, this proves the JWT was created by the authentication server (as you can't create one without the private key) and hasn't been tampered with.  If it _is_ tampered with, i.e someone changes the payload, the signature will no longer match.

Because of this tamper-resistant nature, JWT has quickly become a standard form for authentication tokens.

You can learn more about the JWT approach at [https://jwt.io/](https://jwt.io/).