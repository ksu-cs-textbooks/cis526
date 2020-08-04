---
title: "Routers"
pre: "6. "
weight: 60
date: 2018-08-24T10:53:26-05:00
---

Many web development frameworks built upon this concept of routes by suppling a _router_, and object that would store route patterns and perform the routing operation.  One popular Node library [express](https://expressjs.com/), is at its heart a router.  If we were to write our Node blog using Express, the syntax to create our routes would be:

```js
const express = require('express');
var app = express();

// Home page 
app.get('/', serveHome);

// Posts 
app.get('posts/', servePosts);
app.get('posts/:id', servePost);
app.post('posts/', createPost);
app.post('posts/:id', updatePost);
app.delete('posts/:id', deletePost);

// Comments
app.get('posts/:post_id/comments', servePosts);
app.get('posts/:post_id/comments/:id', servePost);
app.post('posts/:post_id/comments', createPost);
app.post('posts/:post_id/comments/:id', updatePost);
app.delete('posts/:post_id/comments/:id', deletePost);

module.exports = app;
```

The `app` variable is an instance of the express [Application](https://expressjs.com/en/4x/api.html#app) class, which itself is a wrapper around Node's [http.Server](https://nodejs.org/api/http.html#http_class_http_server) class.  The Express `Application` adds (among other features), routing using the route methods `app.get()`, `app.post()`, `app.put()`, and `app.delete()`.  These take routes either in string or regular expression form, and the wildcard values are assigned to an object in `req.params`.  For example, we migh twrite our `servePost()` method as:

```js
servePost(req, res) {
    var id = req.params.id;
    var post = db.prepare("SELECT * FROM posts WHERE ID = ?", id);
    // TODO: Render the post HTML
}
```

The parameter name in params is the same as the token after the `:` in the wildcard.

Routers can greatly simplify the creation of web applications, and provide a clear and concise way to specify routes. For this reason, they form the heart of most dynamic web development frameworks. 