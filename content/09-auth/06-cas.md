---
title: "CAS"
pre: "6. "
weight: 60
date: 2018-08-24T10:53:26-05:00
---

Let's start our discussion of single-sign on strategies with Central Authentication Service (CAS).  We'll do this because it is one of the more straightforward approaches to Single Sign On, and one you've probably used every day as a K-State student, as it is the basis of Kansas State University's eid login system.

CAS is a standard protocol that involves two servers and the client computer.  One server is the host of the app and the other is the authentication server.  The flow is fairly straightforward:

1. The user visits the app server, which determines the user is not logged in 

2. The app server redirects the browser to the authentication server, providing in the url as a query parameter URL to return the authenticated user to

3. The authentication server sends the browser a login form

4. The user fills out and submits the form, which goes back to the authentication server

5. If the authentication is unsuccessful, the authentication server re-sends the form (returning to step 3).  If it is successful, the authentication server redirects the user to the app server, using the URL it provided in the first redirect.  It also sends a ticket (a string of cryptographic random bytes) that corresponds to the login attempt as a query parameter

6. The app server now has to verify that the ticket it received is valid (i.e. it is not counterfeit or an re-used one captured from an earlier login attempt).  To do this, the app server sends a request to validate the ticket to the authentication server

7. If the authentication server sends an XML response indicating if the ticket was valid.  If it is valid, this XML also includes information about the user (at a minimum the username, but it can contain additional information like email, first and last names, etc).

8. Once the app server is sure the ticket is valid, it finishes logging in the user (typically by saving their identity in a session) and sends a welcome page or the page they were attempting to access.

The diagram below visually shows this process:

<img src="https://miro.medium.com/max/1050/1*yCpUC4xPxtYV-LKbUv_TmQ.jpeg" alt="The CAS login process"/>

You can learn more about the CAS approach at [https://www.apereo.org/projects/cas](https://www.apereo.org/projects/cas).