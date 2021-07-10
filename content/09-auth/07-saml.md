---
title: "SAML"
pre: "7. "
weight: 70
date: 2018-08-24T10:53:26-05:00
---

Security Assertion Markup Language (SAML) is a similar single-sign-on strategy to CAS, but one that has a wider adoption in the business world.  The process is quite similar, with the addition that the user agent identifies the user before requesting access.  How it does so is left to the implementer, but it can be an IP address, stored token, or other means.

<img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Saml2-browser-sso-redirect-post.png/600px-Saml2-browser-sso-redirect-post.png" alt="SAML Web Browser Single-Sign On flow"/>

Much like CAS, SAML provides its response in the form of XML. And like CAS, the SAML standard primarily works with traditional, server-based web apps.  We'll turn to some alternatives next.