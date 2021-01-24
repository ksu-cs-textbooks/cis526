---
title: "Web Framework Characteristics"
pre: "3. "
weight: 30
date: 2018-08-24T10:53:26-05:00
---

Web frameworks can be classified in a number of ways, but there are several that you will see pop up in discussions.  For example, an **opinionated** web framework is one that was developed with a strict software architecture that developers are expected to follow.  While it may be possible to deviate from this expected structure, to do so often causes significant headaches and coding challenges.  Ruby on Rails is a good example of an opinionated framework - there is a _Rails Way_ of writing a Ruby on Rails application, and deviating from that way will require a lot more work on your part.

Other frameworks do not try to impose a structure - merely offer a suite of tools to use as you see fit.  While this comes with a great degree of freedom, it also means that you can find wildly divergent example code written using the framework.  Express is a great example of this kind of framework - it is essentially a router that has the ability to add a template library (of your choice) and a database library (of your choice), and does not expect you to lay out your files in any specific way.

Another aspect to frameworks is what kinds of architectural patterns they adopt.  Ruby on Rails, Django, and Microsoft's MVC, all use a [Model-View-Controller architecture](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller).  Express and Phoenix adopt a [Pipeline architecture](https://en.wikipedia.org/wiki/Pipeline_(software)).  Microsoft's [Razor Pages](https://docs.microsoft.com/en-us/aspnet/core/razor-pages/?view=aspnetcore-3.1&tabs=visual-studio), while built on Microsoft MVC, have gone back to a page-based archtecture similar to the server pages we spoke of previously, as does [Next.JS](https://nextjs.org/).

A third distinction is if the framework is _server-side_ (meaning it runs on the server) or _client-side_ (meaning it consists of a JavaScript program that runs in the browser), or a hybrid of the two.  Ruby on Rails, Django, Microsoft's MVC, Express, and Phoenix are all server-side frameworks - they do the bulk of the work of creating the HTML being served on the server.  React, Vue, and Angular are all client-side frameworks that create thier HTML dynamically in the browser using JavaScript, typically through making requests against a web API.  Meteor and NextJS are _hybrids_ that provide both client-side and server-side libraries.