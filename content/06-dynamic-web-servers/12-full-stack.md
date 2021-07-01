---
title: "Full Stack Development"
pre: "12. "
weight: 120
date: 2018-08-24T10:53:26-05:00
---

Server pages represented one approach to tackling the dynamic web server challenge, and one that was especially suitable for those web developers who primarily worked with static HTML, CSS, and JavaScript backgrounds.  

For those that were already skilled programmers, the custom server approach provided less confinement and greater control.  But it came at a cost - the programmer had to author the entire server.  Writing a server from scratch is both a _lot_ of work, and also introduces many more points where design issues can lead to poor performance and vulnerable web apps.

Thus, a third approach was developed, which leveraged existing and well-suited technologies to handle some aspects of the web app needs.  We can separate the needed functionality into three primary areas, each of which is tackled with a different technology:

1. Serving static content
2. Creating and serving dynamic content 
3. Providing persistent data storage

## Serving Static Content
We've already discussed file servers extensively, and even discussed some options for optimizing their performance - like caching the most frequently requested files.  There are a number of software packages that have been developed and optimized for this task.  Some of the best known are:

* [The Apache HTTP Server Project](https://httpd.apache.org/), an open-source server project originally launched in 1995, and consistently the most popular server software on the Internet.  The CS department website is hosted on an Apache server, as is your personal web site on the departmental server.
* [Internet Information Services (IIS)](https://www.iis.net/), Microsoft's flagship web server bundled with the Windows Server operating system.
* [Nginx](https://www.nginx.com/) is also open-source, and intended to be a lighter-weight alternative to Apache HTTP. 

## Creating and Serving Dynamic Content
Creating and serving dynamic content is typically done by writing a custom application.  As pointed out above, this can be done using any programming language. The strategies employed in such web server designs depend greatly upon the choice of language - for example, Node webservers rely heavily on asynchronous operation.

Some interpreted programming languages are typically managed by a web server like Apache, which utilizes plug-ins to run [PHP](https://cwiki.apache.org/confluence/display/HTTPD/PHP), [Ruby](https://www.modruby.net/), or [Python](http://modpython.org/). Similarly, IIS runs ASP.NET program scripts written in C# or Visual Basic. This helps offset some of the time penalty incurred by creating the dynamic content with an interpreted programming language, as static content benefits from the server optimizations.

In contrast, other languages are more commonly used to write a web server that handles _both_ static and dynamic content.  This includes more system-oriented languages like [C/C++](https://isocpp.org/), [Java](https://www.java.com/), and [Go](https://golang.org/)and more interpreted languages like [Node.js](https://nodejs.org/).

In either case, the programming language is often combined with a _framework_ written in that language that provides support for building a web application.  Some of the best-known frameworks (and their languages) are:

* [Express](https://expressjs.com/) (JavaScript)
* [Laravel](https://laravel.com/) (PHP)
* [Flask](https://flask.palletsprojects.com/en/2.0.x/) (Python)
* [Django](https://www.djangoproject.com/) (Python)
* [ASP.NET](https://dotnet.microsoft.com/apps/aspnet) (C#)
* [Ruby on Rails](https://rubyonrails.org/) (Ruby)
* [Grails](https://grails.org/) (Java/Groovy)
* [Phoenix](https://www.phoenixframework.org/) (Elixir)

## Providing Persistent Data Storage
While a file system is the traditional route for persistent storage of data in files, as we saw in our discussion of static file servers, holding data in memory can vastly improve server performance.  However, memory is _volatile_ (it is flushed when the hardware is powered down), so an ideal system combines long-term, file-based storage with in-memory caching. Additionally, _structured access_ to that data (allowing it to be queried systematically and efficiently) can also greatly improve performance of a webserver.

This role is typically managed by some flavor of database application.  Relational databases like the open-source [MySQL](https://www.mysql.com/) and [PostgresSQL](https://www.postgresql.org/), and closed-source [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-2019) and [Oracle Database](https://www.oracle.com/database/) remain popular options.  However, NoSQL databases like [MongoDB](https://www.mongodb.com/) and [CouchDB](https://couchdb.apache.org/) are gaining a greater market share and are ideal for certain kinds of applications. Cloud-based persistence solutions like [Google Firebase](https://firebase.google.com/) are also providing new alternatives.

## The Stack
This combination of software, programming language, along with the operating system running them have come to be referred to as a **stack**.  Web developers who understood and worked with all of the parts came to be known as **full-stack developers**.  

Clearly, there are a _lot_ of possible combinations of technologies to create a stack, so it was important to know _which_ stacks with which a developer was working.  For convenience, the stacks often came to be referred to by acronyms. Some common stacks you will hear of are:

* **LAMP (Linux, Apache, MySQL, PHP)** - the granddaddy of stacks, composed entirely of open-source, free software packages.
* **LEMP (Linux, Nginx, MySQL, PHP)** - basically LAMP substituting the Nginx server for Apache
* **MEAN (MongoDB, Express, Angular, Node)** - Also entirely open-source

Microsoft has their own traditional stack **ASP.NET**, which is built on Windows Server (the OS), IIS (Internet Information Services, the webserver), a .NET language like C# or Visual Basic, and MSSQL. With the launch of .NET Core, you can now also build a .NET stack running on a Linux OS.

Additionally, frameworks like [Django](https://www.djangoproject.com/), [Ruby on Rails](https://rubyonrails.org/), [Express](https://expressjs.com/), [Laravel](https://laravel.com/), etc. often incorporate preferred stacks (though some parts, specifically the server and database, can typically be swapped out). 

{{% notice info %}}
Somewhat confusingly, cloud technologies often replace the traditional webserver role completely, leaving the client-side JavaScript talking to a number of web services.  We'll discuss this approach in a few chapters.
{{% /notice %}}