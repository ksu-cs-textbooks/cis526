---
title: "Introduction"
pre: "1. "
weight: 10
date: 2018-08-24T10:53:26-05:00
---

An important part of any dynamic web server is controlling how, and by whom, it is used.  This is the domain of authentication and authorization.  _Authentication_ refers to mechanisms used to establish the _identity_ of a user, and _authorization_ refers to determining if an authenticated user has permission to do the requested action in the system.  Collectively, these two concepts are often referred to by the abbreviation _auth_.

Consider a content management system (CMS) - a dynamic website for hosting content created by authorized users.  The K-State website is an example of this kind of site - the events, articles, and pages are written by various contributors throughout the university.  It is important that only authorized agents of the university (i.e. staff and faculty) are allowed to publish this content. Can you imagine what would happen if _anyone_ could post _anything_ on the K-State website?

In this chapter, we'll examine strategies for performing both authentication and authorization.