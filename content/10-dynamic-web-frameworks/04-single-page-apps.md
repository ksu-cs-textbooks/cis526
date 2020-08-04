---
title: "Single Page Apps"
pre: "4. "
weight: 40
date: 2018-08-24T10:53:26-05:00
---

Client-side frameworks often focus on creating [single page apps](https://en.wikipedia.org/wiki/Single-page_application).  In this pattern, the entire website consists of a single HTML page with very little content, mostly the `<script>` elements to download a large client-side JavaScript library.  Once downloaded, this library populates the page with HTML content by directly manipulating the DOM.  

Consider a drawing application for creating pixel art.  It is entirely possible to write a single-page application that only needs a webserver to serve its static HTML and JavaScript files.  Once downloaded into the browser, you could draw with it and download the resulting images directly out of the browser - no further server interaction is needed! Thus, you can host such an app on a simple static hosting service at very low cost.

On the other hand, if you _did_ need server functionality (say you want to be able to save drawings to the server and re-open them on a different machine), you can combine your client-side app with a server-side API.  It would provide authentication and persistent storage through a few endpoints, most likely communicating through sending JSON as requests and responses.  

A good example of this kind of client-side application is MIT Media Labs' [Scratch](https://scratch.mit.edu), a block-based programming environment for teaching programming.  The Scratch Development Environment is a client-side app that provides the programming environment, a vm for running the Scratch program, and the user interface code for displaying the result of running that program.  All of the computation of running the Scratch program is therefore done in the browser's JavaScript environment, _not_ on the server.  The server provides a minimal API for saving Scratch projects and thier resources, as well as publishing them - but the actual heavy computation is always done on the client.

This approach - offloading heavy computation to the browser instead of the server means servers don't need to work as hard. The benefit is they can be less powerful machines and serve _more_ users while consuming _less_ power, and generating less waste heat.  This is why Google Docs, Microsoft 360, Facebook, and other big players have been pushing as much of thier site's computational needs to the client for years.
