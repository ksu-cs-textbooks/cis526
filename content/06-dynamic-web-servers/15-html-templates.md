---
title: "HTML Templates"
pre: "5. "
weight: 50
date: 2018-08-24T10:53:26-05:00
draft: true
---

While full-stack developers may have chafed at the restrictions imposed by server pages, there was one aspect that came to be greatly valued - the ability to embed script directly in HTML, and have it evaluated and concatenated into the HTML text.

## Template Libraries
This is where template libraries come in.  A template library allows you to write your HTML content _as HTML in a separate file_ with a special syntax to inject dynamic programming script.  This is often some variation of `<>` or `{}`.  This approach allows you to validate the HTML, as the script portions are ignored as unknown tags (when using `<>`) or as static text.

When the server is running, these templates are rendered, evaluating any code and supplying the applicable variables. This process generates the HTML snippet.  

This is similar to what server pages do. However, server pages represent an _integrated_ approach - the server page framework defined all aspects of how you could interact with the OS, the web server, and other programs.  In contrast, a template library provides the option of using templates within any project - obviously for generating HTML as part of a dynamic website, but potentially for other kinds of applications as well.  

Thus, a template rendering library gives us a lot of flexibility in how and when we use it. For example, in using the [Embedded JavaScript](https://ejs.co/) template library, we could rewrite our directory listing as:

```html
<!doctype html>
<html>
    <head>
        <title>Directory Listing</title>
    </head>
    <body>
        <h2>Directory Listing for <%= pathname %></h2>
        <div style="display: flex; flex-direction: column; padding: 2rem 0">
        <% entries.forEach((entry) =>{ %>
            <a href="<%= path.posix.join(pathname, entry) %>">
                <%= entry %>
            </a>
        <% }) %>
        </div>
        <% if (pathname !== "/") { %>
            <a href="<%= path.dirname(pathname) %>">
                Parent directory
            </a>
        <% } %>
    </body>
</html>
```

Notice how we can embed the JavaScript _directly into the file_.  In a Node server, we can use this template to render html:

```js

// Build the dynamic HTML snippets
var data = {
    pathname: pathname,
    entries: entries,
    path: path
};
ejs.renderFile("templates/directory-listing.ejs", data, function(err, html){
    // TODO: render the HTML in the string variable html
});

```

While this may _seem_ like just as much work as the concatenation approach, where it really shines is the ability to combine multiple templates, separating parts of the pages out into different, reusable template files.  These are typically separated into two categories based on how they are used, _partials_ and _layouts_.

### Partials
A partial is simply a _part_ of a larger page.  For example, the entries we are rendering in the listing could be defined in their own template file, _directory-listing-entry.ejs_:

```html
<a href="<%= path %">
    <%= entry %>
</a>
```

And then _included_ in the _directory-listing.ejs_ template:

```html
<!doctype html>
<html>
    <head>
        <title>Directory Listing</title>
    </head>
    <body>
        <h2>Directory Listing for <%= pathname %></h2>
        <div style="display: flex; flex-direction: column; padding: 2rem 0">
        <% entries.forEach((entry) =>{ %>
            <%- include('directory-listing-entry' {entry: entry, path: path.posix.join(pathname, entry) }) %>
        <% }) %>
        </div>
        <% if (pathname !== "/") { %>
            <a href="<%= path.dirname(pathname) %>">
                Parent directory
            </a>
        <% } %>
    </body>
</html>
```

While this may seem overkill for this simple example, it works incredibly well for complex objects.  It also makes our code far more modular - we can use the same partial in many parts of our web application.

### Layouts
A second common use of templates is to define a _layout_ - the parts that every page holds in common.  Consider this template file, _layout.ejs_:

```html
<!doctype html>
<html>
    <head>
        <title><%= title %></title>
    </head>
    <body>
        <%- include('header') %>
        <%- content %>
        <%- include('footer') %>
    </body>
</html>
```

Now our directory listing can focus entirely on the directory listing:

```html
<h2>Directory Listing for <%= pathname %></h2>
<div style="display: flex; flex-direction: column; padding: 2rem 0">
<% entries.forEach((entry) =>{ %>
    <%- include('directory-listing-entry' {entry: entry, path: path.posix.join(pathname, entry) }) %>
<% }) %>
</div>
<% if (pathname !== "/") { %>
    <a href="<%= path.dirname(pathname) %>">
        Parent directory
    </a>
<% } %>
```

And we can render our page using the layout:

```js
// Build the dynamic HTML snippets
var data = {
    pathname: pathname,
    entries: entries,
    path: path
};
ejs.renderFile("templates/directory-listing.ejs", data, function(err, content){
    if(err) {
        // TODO: handle error
        return;
    }
    ejs.renderFile("templates/layout.ejs", {content: content}, function(err, html) {
        // TODO: render the HTML in the string variable html
    });
});
```

This layout can be re-used by all pages within our site, allowing us to write the HTML shared in common by the whole website once.

Also, while these examples show reading the template files as the response is being generated, most template engines support _compiling_ the templates into a function that can be called at any time.  This effectively caches the template, and also speeds up the rendering process dramatically.


### Concise Templating Languages

Some template libraries have leveraged the compilation idea to provide a more concise syntax for generating HTML code.  For example, the directory listing written using [Pug](https://pugjs.org/api/getting-started.html) templates would be:

```pug
doctype html
html(lang="en")
    head
        title= Directory Listing
    body
        h2= 'Directory Listing for ' + pathname 
        div(style="display: flex; flex-direction: column; padding: 2rem 0")
        each entry in entries
            a(href=path.posix.join(pathname, entry)) entry 
        if pathname !== "/"
            a(href=path.dirname(pathname))
                Parent directory
```

Concise templating languages can significantly reduce the amount of typing involved in creating web pages, but they come with a trade-off.  As you can see from the code above, learning Pug effectively requires you to learn a new programming language, including its own iteration and conditional syntax.


{{% notice info %}}
EJS is just one template library available in JavaScript.  Some of the most popular ones include:

* [Moustache](https://mustache.github.io/)
* [Underscore](http://underscorejs.org/)
* [Handlebars](https://handlebarsjs.com/)
* [Nunjucks](https://mozilla.github.io/nunjucks/)
* [Underscore](http://underscorejs.org/)
* [Pug](https://pugjs.org/api/getting-started.html)

It is useful to compare how these different libraries approach templates as there are often large differences, not only in syntax but also in function.
{{% /notice %}}

## Components

A newer approach, popularized by the [React](https://reactjs.org/) framework, emphasizes building _components_ rather than _pages_.  A component can be thought of as a single control or widget on a page.  While conceptually similar to the partials described above, it organizes its structure, styling, and scripting into a cohesive and reuseable whole. 

This represents a move away from the separation of concerns we described earlier.  It often incorporates aspects of [declarative programming](https://en.wikipedia.org/wiki/Declarative_programming) rather than thinking of programming in terms of control flow.  This component-based approach also lends itself to developing [progressive web applications](https://en.wikipedia.org/wiki/Progressive_web_application), which only download the script needed to run the portion of the app the user is interacting with at a given time.

As this approach is significantly different from the more traditional templating libraries, we'll discuss these ideas in the next chapter.