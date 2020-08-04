---
title: "Query and Hash Strings"
pre: "6. "
weight: 60
date: 2018-08-24T10:53:26-05:00
---
Query strings (aka search strings) are the part of the URL that appear after the `?` and before the optional `#`.  The hash string is the portion of the url after the `#`.  We've mentioned them a bit before, but as we dig into dynamic web servers it makes sense to do a deeper dive, as this is where they really come into play.

## The Hash String
First, let's briefly visit the hash string.  It's traditional use is to indicate a HTML element on the page the browser should scroll to when visiting the URL.  When used this way, its value is the `id` attribute of the element.  The browser will automatically scroll to a position that displays the element on-screen.  Thus, the traditional use of the hash string is for "bookmarked" links that take you to an exact section of the page, like this one which takes you to a description of your personal CS web space: [https://support.cs.ksu.edu/CISDocs/wiki/Personal_Web_Pages#Dynamic_Content)](https://support.cs.ksu.edu/CISDocs/wiki/Personal_Web_Pages#Dynamic_Content).

With the advent of single-page apps, it has come to serve additional purposes; but we'll talk about those when we visit that topic in a future chapter.

## The Query/Search String
Now, the Query string is a vital tool for dynamic web pages, as it conveys information _beyond_ the specific resource being asked for to the server.  Consider what a dynamic webserver does - it takes an incoming request, and sends a response.  In many ways, this is similar to a function call - you invoke a function, and it returns a value.  With this in mind, the path of the URL is like the function name, and the query string becomes its _parameters_.  

Much like parameters have a name and a value, the query string is composed of key/value pairs.  Between the key and value of each pair is a `=`, and between the pairs is a `&`.  Because the `=` and `&` character now have a special meaning, any that appear in the key or value are swapped with a special percent value, i.e. `&` becomes `%26` and `=` becomes `%3D`. Similarly, other characters that have special meanings in URLs are likewise swapped.  This is known as URL or percent encoding, and you can see the swapped values in the table below:

<table class="standard-table">
 <tbody>
  <tr>
   <td><code>':'</code></td>
   <td><code>'/'</code></td>
   <td><code>'?'</code></td>
   <td><code>'#'</code></td>
   <td><code>'['</code></td>
   <td><code>']'</code></td>
   <td><code>'@'</code></td>
   <td><code>'!'</code></td>
   <td><code>'$'</code></td>
   <td><code>'&amp;'</code></td>
   <td><code>"'"</code></td>
   <td><code>'('</code></td>
   <td><code>')'</code></td>
   <td><code>'*'</code></td>
   <td><code>'+'</code></td>
   <td><code>','</code></td>
   <td><code>';'</code></td>
   <td><code>'='</code></td>
   <td><code>'%'</code></td>
   <td><code>' '</code></td>
  </tr>
  <tr>
   <td><code>%3A</code></td>
   <td><code>%2F</code></td>
   <td><code>%3F</code></td>
   <td><code>%23</code></td>
   <td><code>%5B</code></td>
   <td><code>%5D</code></td>
   <td><code>%40</code></td>
   <td><code>%21</code></td>
   <td><code>%24</code></td>
   <td><code>%26</code></td>
   <td><code>%27</code></td>
   <td><code>%28</code></td>
   <td><code>%29</code></td>
   <td><code>%2A</code></td>
   <td><code>%2B</code></td>
   <td><code>%2C</code></td>
   <td><code>%3B</code></td>
   <td><code>%3D</code></td>
   <td><code>%25</code></td>
   <td><code>%20</code> or <code>+</code></td>
  </tr>
 </tbody>
</table>

In JavaScript, the [encodeURIComponent()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) function can be used to apply percent encoding to a string, and the [decodeURIComponent()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent) can be used to reverse it.  

Node offers the [querystring](https://nodejs.org/api/querystring.html) library.  It offers a [querystring.parse()](https://nodejs.org/api/querystring.html#querystring_querystring_parse_str_sep_eq_options) method which can parse a query string into a JavaScript object with the decoded key/value pairs transformed into properties and a [querystring.stringify()](https://nodejs.org/api/querystring.html#querystring_querystring_stringify_obj_sep_eq_options) method which can convert a JavaScript object into an encoded query string.  In addition, these methods allow you to override what characters are used as delimeters, potentially allowing you to use alternative encoding schemes.

## Forms and the Query String
While we can type a URL with a query string manually, by far the most common way to produce a query string is with a `<form>` element.  When a form is submitted (the user clicks on a `<input>` with `type` attribute of `"submit"`), it is serialized and submitted to the server.  By default, it will be sent to the same URL it was served from, using a GET request, with the fields of the form serialized as the query string.

This is why one name for the query string is the _search_ string, as it is commonly used to submit search requests.  For example, Google's search page contains a form similar to this (very simplified form):

```html
<form>
    <input name="q" type="text">
    <input type="submit" value="Google Search">
</form>
```

Notice the form has one text input, named `"q"`.  If we type in search terms, say "k-state computer science" and click the search button, you'll notice in the resulting url the query string contains `q=k-state+computer+science` (plus a lot of other key/value pairs).  If you type `"https://www.google.com/search?q=k-state+computer+science"` into the address bar, you'll get the same page.

Notice though, that google uses `www.google.com/search` as the URL to display search results at, instead of the original `www.google.com` page.  We can have a form submit to a different URL than it was served on by setting its `action` attribute to that URL.

We can also change the HTTP method used to submit the form with the `method` attribute. By default it uses a GET request, but we can instead set it to a POST request.  When a POST request is used, the form is no longer encoded in the query string - it is instead sent as the body of the POST request. 

