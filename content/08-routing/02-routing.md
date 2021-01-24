---
title: "Request Routing"
pre: "2. "
weight: 20
date: 2018-08-24T10:53:26-05:00
---

In web development, routing refers to the process of matching an incoming request with generating the appropriate response.  For most web servers (and definitely for Node-based ones), we abstract the process of generating the response into a function.  We often call these functions _endpoints_ as their purpose is to serve the response, effectively ending the processing of an incoming request with an appropriate response.

With a Node webserver, endpoint functions typically take in a `req` (an instance of http.IncomingMessage) and `res` (an instance of http.ServerResponse) objects. These objects form an abstraction around the HTTP request and response.  

Routing in a Node webserver therefore consists of examining the properties of the `req` object and determining which endpoint function to invoke.  Up to this point, we've done this logic in a `handleRequest()` function, in a fairly ad-hoc way.  Consider what we might need to do for a dynamically generated blog - we'd need to serve static files (like CSS and JS files), as well as dynamically generated pages for blog posts and the home page.  What might our `handleRequest()` look like in that case?

Let's assume we have a `serveHome()` function to serve the home page, a `serveFile()` function to serve static files, and a `servePost()` function to serve dynamically generated posts.  Determining if the request is for the homepage is easy, as we know the path should just be a forward slash:

```js
    // Determine if the request is for the index page
    if(req.url === '/') return serveHome(req, res);
```

But what about determining if a request is for a post or a static file?  We could use `fs.stat` to determine if a file exists:

```js
    // Determine if a corresponding file exists 
    fs.stat(path.join("public", req.url), (err, stat) => {
        if(err) {
            // Error reading file, might be a post?
            servePost(req, res);
        }
        else {
            // File exists, serve it 
            serveFile(req, res);
        }
    });
```

This would work, but it's a bit ugly.  Also, using a filesystem method like `fs.stat` is  potential bottleneck in our application; we'd like to avoid it if at all possible.

If we make all our posts use the url `/posts`, we could use the query string to determine which post we want to display.  This approach is a bit cleaner, though it does mean we need to separate the pathname from our URL:

```js
public handleRequest(req, res) {
    
    // Separate the pathame from the url 
    const pathname = new URL(req.url, "http://localhost").pathname;

    // Determine if the request is for the index page
    if(pathname === '/') return serveHome(req, res);

    // Determine if the request is for a post 
    if(pathame === '/post') return servePost(req, res);

    // Treat all other requests as a file 
    serveFile(req, res);
}
```

This is a bit cleaner of an approach, but it still has a very ad-hoc feel and requires us to incorporate query strings into some of our URLs.