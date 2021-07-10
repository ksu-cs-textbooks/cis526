---
title: "Single Sign On"
pre: "5. "
weight: 50
date: 2018-08-24T10:53:26-05:00
---

It should be clear from our earlier discussion that there are some very real challenges to writing a good authentication approach.  These challenges can be broken into two categories, those that face us as the programmer, and those that arise from our users:

#### Programmer Challenges 
For us as the programmer, there are a lot of steps in creating an authentication strategy that we *must* get right.  We also must be very careful about how we store the authentication data - i.e. passwords should **always** be stored encrypted, never as plain text.  And having actual authentication data in our site makes us a juicer target for adversaries, and potentially ups the stakes if our site is compromised.  

Finally, what constitutes best practice in authentication _is constantly changing_.  And to make sure we are doing everything as securely as possible _we should be updating our apps to follow current best practices._  This is obviously a lot of work.

#### User Challenges
For the user, having _yet another login and password_ contributes to a number of problems.  Users struggle to remember multiple passwords, and often default to using the _same_ login and password across multiple sites.  This means their credentials are only as secure as the worst-implemented security of those sites.  While your app might have stellar security, your user might be compromised by a completely different site you have no influence over.  Also, users often resort to writing down credentials - leaving them open to being found and used by others.

### Single Sign On
Single-sign on is a solution to both sets of challenges.  The basic idea is to have one authentication service that is used for multiple, often completely independent applications.  A user only needs to remember one login and password for _all_ the applications, and authentication is done on one special-built server that can be updated to the latest best practices with ease.  

Of course, to implement single-sign on, we need a way to establish trust between the authenticating server and the other web apps that use it.  Thus, we need a standardized process to draw upon.  We'll discuss several in the next couple of sections.