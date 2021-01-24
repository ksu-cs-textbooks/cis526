---
title: "CGI Scripts"
pre: "2. "
weight: 20
date: 2018-08-24T10:53:26-05:00
---

Before we dig too deeply into dynamic web servers, we should reveiw our technologies used in the web.  On the client side, we have HTML, CSS, and JavaScript.  Managing communication between the client and server, we have HTTP.  But on the server side of the equation, what standard web technologies do we use?

![The Web Technologies]({{<static "images/5.2.1.png">}})

The answer is _none_.  There **is no standard server development language**.  In fact, web servers can be written in _almost every programming language_.  This gives web application developers a tremendous amount of flexibility.  Of course, that also means the choice of server-side technologies can quickly become overwhelming.

One technology that emerged to help manage some of this complexity was the [Common Gateway Interface (CGI)](https://en.wikipedia.org/wiki/Common_Gateway_Interface), a web standard that allowed a traditional static webserver to respond to some requests by running a command-line program and piping the output to the requesting client.  The CGI standard defined what variables needed to be collected by the web server and how they would be provided to the script.

The script itself could be written in any language that could communicate using stdin and stdout, though in practice most CGI scripts were written using Perl or Bashscript.  This strategy was popular with the system admins responsible for deploying webservers like Apache, as these scripting languages and command-line programs were familiar tools. While CGI scripts can be used to build dynamic web pages, by far their most common use was to consume forms filled out by a user, often saving the results to a file or database or sending them via email.

CGI scripts are still used today, but they do have some important limitations.  First, for each kind of request that needed handled, a new script would need to be written.  The open-ended nature of CGI scripts meant that over time a web application become a patchwork of programs developed by different developers, often using different languages and organizational strategies.  And since running a CGI script typically means starting a separate OS process _for each request_, the CGI approach does not scale well to web applications in high demand.

Thus, web developers began seeking new strategies for building cohesive web servers to provide rich dynamic experiences.

{{% notice info %}}
Your personal web space on the CS Departmental Server supports CGI scripts.  So if you would like to try to develop one, you can deploy it there.  More details can be found on the support [Personal Web Pages](https://support.cs.ksu.edu/CISDocs/wiki/Personal_Web_Pages#Dynamic_Content) entry.
{{% /notice %}}