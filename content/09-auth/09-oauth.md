---
title: "OAuth"
pre: "9. "
weight: 90
date: 2018-08-24T10:53:26-05:00
---

OAuth 2.0 is perhaps the best-known single-sign-on solution.  Many of the big internet players provide OAuth services: Google, Microsoft, Facebook, Twitter, etc.  However, OAuth is significantly more complex than the other approaches we've talked about, as it really a standard for _access delegation_, i.e. a way for users to authorize third-party apps to access their information stored with the identity provider.  

I.e. if you write an app that works with the Facebook API and needs access to a users' friends list, then OAuth allows you to authorize Facebook to share that info with your app.  This authorization is done by the user through Facebook, and can be revoked at any time.  

Despite being built to help with access delegation, OAuth 2.0 can (and often is) used soley for the purpose of single-sign-on.

The OAuth protocol flow 

1. The user requests a resource
2. The app server redirects the user's browser to the identity server, along with a a request for identity
3. The identity server prompts the user to log in (if they aren't already)
4. The identity server redirects the user back to the app server providing an encoded response and identity token (typically a JWT)
5. The app server _decodes_ the response, and determines if the user has been authenticated 
6. The identity token can now be used to access the approved services of the identity provider

Notice the big difference here between CAS and SAML is that the app server doesn't need to contact the identity server directly to authenticate the user.  This is because the app server is _registered_ with the identity server, which provides it both an client id and secret.  The client id is a public identifier used to uniquely identify the web app amongst all those that use the identity service, and the secret *should be* known only to the web app and the identity server.  This client id, secret, and user's token are sent to the authenticating server when requests are made for its services.

OAuth is sometimes referred to as pseudo-identity, as its real purpose is to provide access to the services of the identity provider.  OpenID is another standard built on top of OAuth that goes one step farther - issuing an authentication certificate certifying the identity of the user.  A comparison of the two processes appears in the graphic below:

<img src="https://upload.wikimedia.org/wikipedia/commons/3/32/OpenIDvs.Pseudo-AuthenticationusingOAuth.svg" alt="Oauth"/> [^1]

[^1]: File:OpenIDvs.Pseudo-AuthenticationusingOAuth.svg. (2020, October 22). Wikimedia Commons, the free media repository. Retrieved 15:38, June 2, 2022 from https://commons.wikimedia.org/w/index.php?title=File:OpenIDvs.Pseudo-AuthenticationusingOAuth.svg&oldid=496954680.

