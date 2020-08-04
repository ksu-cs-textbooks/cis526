---
title: "Full Stack Development"
pre: "4. "
weight: 40
date: 2018-08-24T10:53:26-05:00
---

Server pages represented one approach to tackling the dynamic web server challenge, and one that was especially suitable for those web developers who primarily worked with static HTML, CSS, and JavaScript backgrounds.  But for those that were already programmers, the server page approach could feel confining.  Instead, these programmers wanted more control over the web server and its working parts.

Of course, writing a brand-new web server from the ground up is an exhausting and expensive proposition.  So most developers adopted existing technologies that were highly optimized to play a specific role, and wrote server code that would utilize them while adding the dynamic portions.  

For a dynamic web server, we can separate the needed functionality into three primary areas:

1. Serving static content
2. Creating and serving dynamic content 
3. Providing persistent data storage

## Serving Static Content
We've already discussed file servers extensively, and even discussed some options for optimizing thier performance - like caching the most frequently requested files.  There are a number of software packages that have been developed and optimized for this task.  Some of the best known are:

* [The Apache HTTP Server Project](https://httpd.apache.org/), an open-source server project originally launched in 1995, and consistently the most popular server software on the Internet.  The CS department website is hosted on an Apache server, as is your personal web site on the deparmental server.
* [Internet Information Services (IIS)](https://www.iis.net/), Microsoft's flagship web server bundled with the Windows Server operating system.
* [Nginx](https://www.nginx.com/) is also open-source, and intended to be a lighter-weight alternative to Apache HTTP. 

## Creating and Serving Dynamic Content
Creating and serving dynamic content is typically done by writing a custom application.  As pointed out above, this can be done using any programming language. The strategies employed in such web server designs depend greatly upon the choice of language - for example, Node webservers rely heavily on asynchronous operation.

Some interpreted programming langauges are typically managed by a web server like Apache, which utilizes plug-ins to run [PHP](https://cwiki.apache.org/confluence/display/HTTPD/PHP), [Ruby](https://www.modruby.net/), or [Python](http://modpython.org/). Similarly, IIS runs ASP.NET program scripts written in C# or Visual Basic. This helps offset some of the time penalty incurred by creating the dynamic content with an interpreted programming language, as static content benefits from the server optimizations.

In contrast, other languages are more commonly used to write a web server that handles _both_ static and dynamic content.  This includes more system-oriented languages like [C/C++](https://isocpp.org/), [Java](https://www.java.com/), and [Go](https://golang.org/)and more interpreted languages like [Node.js](https://nodejs.org/).

## Providing Persistent Data Storage
While a file system is the traditional route for persistent storage of data in files, as we saw in our discussion of static file servers, holding data in memory can vastly improve server performance.  However, memory is _volitale_ (it is flushed when the hardware is powered down), so an ideal system combines long-term, file-based storage with in-memory caching. Additionally, _structured access_ to that data (allowing it to be queried systematically and efficiently) can also greatly improve performance of a webserver.

This role is typically managed by some flavor of database application.  Relational databases like the open-source [MySQL](https://www.mysql.com/) and [PostgresSQL](https://www.postgresql.org/), and closed-source [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-2019) and [Oracle Database](https://www.oracle.com/database/) remain popular options.  However, NoSQL databases like [MongoDB](https://www.mongodb.com/) and [CouchDB](https://couchdb.apache.org/) are gaining a greater market share and are ideal for certain kinds of applications. Cloud-based persistence solutions like [Google Firebase](https://firebase.google.com/) are also providing new alternatives.

## The Stack
This combination of sofware, programming language, along with the operating system running them have come to be referred to as a **stack**.  Web developers who understood and worked with all of the parts came to be known as **full-stack developers**.  

Clearly, there are a _lot_ of possible combinations of technologies to create a stack, so it was important to know _which_ stacks with which a developer was working.  For convenience, the stacks often came to be referred to by acronyms. Some common stacks you will hear of are:

* **LAMP (Linux, Apache, MySQL, PHP)** - the grandaddy of stacks, composed entirely of open-source, free software packages.
* **LEMP (Linux, Nginx, MySQL, PHP)** - basically LAMP substituting the Nginx server for Apache
* **MEAN (MongoDB, Express, Angular, Node)** - Also entirely open-source

Microsoft has thier own traditional stack **ASP.NET**, which is built on Windows Server (the OS), IIS (Internet Information Services, the webserver), a .NET language like C# or Visual Basic, and MSSQL. With the launch of .NET Core, you can now also build a .NET stack running on a Linux OS.

Additonally, frameworks like [Django](https://www.djangoproject.com/), [Ruby on Rails](https://rubyonrails.org/), [Express](https://expressjs.com/), [Laravel](https://laravel.com/), etc. often incorporate preferred stacks (though some parts, specifically the server and database, can typically be swapped out).  We'll discuss web serve frameworks in the next chapter.

For the rest of this chapter, we'll discuss the tehniques used by full-stack developers in building dynamic web servers.

{{% notice info %}}
Somewhat confusingly, cloud technologies often replace the traditional webserver role completely, leaving the client-side JavaScript talking to a number of web services.  We'll discuss this approach in a few chapters.
{{% /notice %}}