---
title: "Form Encoding"
pre: "7. "
weight: 70
date: 2018-08-24T10:53:26-05:00
---

When a form is submitted as a POST request, its inputs are serialized according to the form's encoding strategy.  This value is also used as the `Content-Type` header of the request.  The three form encoding values are:

* `application/x-www-form-urlencoded` (the default)
* `multipart/form-data` (used for file uploads)
* `text/plain` (used for debugging)

The `<form>` element's `enctype` attribute can be set to any of these three possible values.

## application/x-www-form-urlencoded

This serialization format consists of key/value pairs where the keys and values are url (percent) encoded, and between each key and value is a `=` and between each pair is a `&`.  In other words, it is the same encoding that is used in the query string - the only difference is the query string begins with a `?`.

Thus, the form:

```html
<form method="post">
    <input type="text" name="first" placeholder="Your first name">
    <input type="text" name="middle" placeholder="Your middle initials">
    <input type="text" name="last" placeholder="Your last name">
    <input type="number" name="age" placeholder="Your age">
    <input type="submit" value="Save My Info">
</form>
```

When submitted by John Jacob Jingleheimer Schmidt would be encoded:

```
first=John&middle=J.+J.&last=Schmidt&age=30
```

If we parsed this string with [querystring.parse()](https://nodejs.org/api/querystring.html#querystring_querystring_parse_str_sep_eq_options) the resulting JavaScript object would be:

```js
{
    first: "John",
    middle: "J. J.",
    last: "Schmidt",
    age: "30"
}
```
{{% notice warning %}}
It is important to note that even though age started as a numerical value, it becomes a string in the conversion process.  **All values submitted in a form will be interpreted as strings on the server.** If we need it to be a number again, we can always use [parseInt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) on it.
{{% /notice %}}

## multipart/form-data

There is one limitation to the `application/x-www-form-urlencoded` encoding strategy - there is no way to include binary data, i.e. files.  If you submit a form that includes an `<input>` of type `file` and encode it with `application/x-www-form-urlencoded`, the value supplied by the `<input type="file">` will be the filename only.  The actual body of the file will not be available.  The reason is simple - there's no easy way to put raw binary data into a text file.

The `multipart/form-data` solves this in a less-than easy way. It splits the body into blocks - one for each input.  Between each block is a sequence of bytes used as a separator.  These boundary bytes cannot be found in any of the file data (as if it were, that block would be split up).  And each block has its own header section and body section.  The header defines what the input is, and what its body contains.  If it was a non-file input, it will be text, and if it was a file input, the content will be the raw bytes, encoded in base64.

When the server recieves this body, it must use the boundary bytes to separate the blocks, and then parse each block.  There are no built-in libraries in Node for doing this, though there are many npm packages that do.  We'll also write our own from scratch so that we get a good feel for it.