---
title: "Summary"
pre: "10. "
weight: 100
date: 2018-08-24T10:53:26-05:00
---

In this chapter we discussed many of the possible authentication strategies for web applications, as well as the strengths and drawbacks.  To reiterate the most salient points:

* Passwords should **NEVER** be stored as plain text!
* Authentication processes should follow _current_ industry best-practices.  This is not the place to experiment!
* Industry best practices are constantly changing, as ever-improving computer technology renders older techniques ineffective

Following these guidelines can help keep your users safe and secure.  Or you can use a singe-sign-on solution to allow another service to take on the responsibility for authentication.  But if you do, you must follow the standard _exactly_, and protect any secrets or private keys involved.  Failing to do so will expose your users' data.