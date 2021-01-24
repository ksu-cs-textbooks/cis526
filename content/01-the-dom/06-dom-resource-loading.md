---
title: "The DOM and External Resource Loading"
pre: "6. "
weight: 60
date: 2018-08-24T10:53:26-05:00
---
One of the important aspects of working with HTML is understanding that an HTML page is _more_ than just the HTML.  It also invovles a collection of resources that are external to the HTML document, but displayed or utilized by the document.  These include elements like `<link>`, `<script>`, `<video>`, `<img>`, and `<source>` with `src` or `href` attributes set.

As the DOM tree is parsed and loaded and these external resources are encountered, the browser requests those resources as well.  Modern browsers typically make these requests in parallel for faster loading times.  

Once the HTML document has been completely parsed, the `window` triggers the [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event) event.  This means the HTML document has been completely parsed and added to the DOM tree.  However, the external resources _may not have all been loaded at this point_.

Once those resources are loaded, a separate [Load](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event) event is triggered, also on the `window`.

Thus, if you have JavaScript that should only be invoked _after_ the page has fully loaded, you can place it inside an event listener tied to the `load` event, i.e.:

```javascript
window.addEventListener('load', function(event) {
    // TODO: Add your code here ...
});
```

Or, if you want it invoked after the DOM is fully parsed, but external resources may still be loading:

```javascript
window.addEventListener('DOMContentLoaded', function(event) {
    // TODO: Add your code here ...
});
```

The former - waiting for all resources to load - tends to be the most common. The reason is simple, if you are loading multiple JavaScript files, i.e. a couple of libraries and your own custom code, using the `'load'` event ensures they have all loaded before you start executing your logic.  

Consider the popular [JQuery](https://jquery.com/) library, which provides shorthand methods for querying and modifying the DOM.  It provides a `JQuery()` function that is also aliased to the `$`.  The JQuery code to show a popup element might be:

```javascript
$('#popup').show();
```

But if the JQuery library isn't loaded yet, the `$` is not defined, and this logic will crash the JavaScript interpreter.  Any remaining JavaScript will be ignored, and your page won't work as expected.  But re-writing that to trigger after all resources have loaded, i.e.:

```javascript 
window.addEventListener = function(event) {
    // This code only is executed once all resources have been loaded
    $('#popup').show();
}
```

Ensures the JQuery library is available before your code is run.

{{% notice info %}}
JavaScript is an extremely flexible langauge that has evolved over time.  One side effect of this evolution is that there are often multiple ways to express the same idea.  For example, listening for the `window`'s `'load'` event can be written many different ways:

```javascript
// Using the onload property
window.onload = function(event) {...}

// Using onload property and lambda syntax 
window.onload = (event) => {...}

// Using the addEventListener and lambda syntax
window.addEventListener('load', (event) => {
    ...
});

// Using the JQuery library 
JQuery(function(){...});

// Using the JQuery library with lambda syntax 
JQuery(() => {...});

// Using the JQuery library with $ alias
$(function(){...});
```

You are free to use whichever approach you like, but need to be able to interpret other programmers' code when they use a different approach.

{{% /notice %}}

## Loading Resources _after_ the DOM is loaded

There are really _two_ ways to load resources into an HTML page from your JavaScript code.  One is indirect, and the other direct.  The indirect method simply involves creating DOM elements linked to an outside resource, i.e.:

```js
var image = document.createElement('img');
image.src = 'smile.png';
document.body.appendChild(img);
```

In this case, when the new `<img>` element has its `src` attribute set, the image is requested by the browser.  Attaching it to the DOM will result in the image being displayed once it loads.

If we want to know when the image is loaded, we can use the `load` event:

```js
var image = document.createElement('img');
image.addEventListener('load', function(event){
    console.log('loaded image');
});
image.src = 'smile.png';
```

Notice too that we add the event listener _before_ we set the `src` attribute.  If we did it the other way around, the resource may already be loaded before the listener takes effect - and it would never be invoked!

However, this approach can be cumbersome, and limits us to what resources can be bound to HTML elements.  For more flexibility, we need to make the request directly, using AJAX. We'll take a look at doing so after we cover HTTP in more depth.