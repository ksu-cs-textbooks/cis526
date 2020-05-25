---
title: "JavaScript and the DOM"
pre: "4. "
weight: 40
date: 2018-08-24T10:53:26-05:00
---

The DOM tree is also accessible from JavaScript running in the page.  It is accessed through the global [window](https://developer.mozilla.org/en-US/docs/Web/API/Window) object, i.e. `window.document` or `document`.

Let's use the 'Console' tab of the developer tools to access this object.  Open the previous example page again from <a href='{{<static "images/1.3.2.png">}}' target='_blank'>this link</a>.  Click the console tab to open the expanded console, or use the console area in the bottom panel of the elements tab:

![The console tab in the developer tools]({{<static "images/1.4.1.png">}})

With the console open, type:

```js
> document
```

{{% notice info %}}
When instructed to type something into the console, I will use the `>` symbol to represent the cursor prompt.  You do _not_ need to type it.
{{% /notice %}}

Once you hit the enter key, the console will report the value of the expression `document`, which exposes the document object.  You can click the arrow next to the `#document` to expose its properties:

![The reported document object]({{<static "images/1.4.2.png">}})

The document is an instance of the [Document](https://developer.mozilla.org/en-US/docs/Web/API/document) class.  It is the entry point (and the root) of the DOM tree data structure.  It also implements the [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) and [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) interfaces, which we'll discuss next.

## The Node Interface

All nodes in the DOM tree implement the [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) interface.  This interface provides methods for traversing and manipulating the DOM tree.  For example, each node has a property `parentElement` that references is parent in the DOM tree, a property `childNodes` that returns a [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) of all the Node's children, as well as properties referencing the `firstChild`, `lastChild`, `previousSibling`, and `nextSibling`.

Let's try walking the tree manually.  In the console, type:

```js
> document.body.firstElementChild.firstElementChild
```

The `body` property of the document directly references the `<body>` element of the webpage, which also implements the [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) interface.  The `firstElementChild` references the first HTML element that is a child of the node, so in using that twice, we are drilling down to the `<h1>` element.

![The reported h1 object]({{<static "images/1.4.3.png">}})

## The EventTarget Interface 

Each node in the DOM tree also implements the `EventTarget` interface.  This allows arbitrary events to be attached to any element on the page.  For example, we can add a click event to the `<h1>` element.  In the console, type:

```js
> document.body.firstElementChild.firstElementChild.addEventListener('click', function(e){
    console.log(e.target + ' clicked!');
});
```

The first argument to [EventTarget.addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) is the event to listen for, and the second is a function to execute when the event happens.  Here we'll just log the event to the console.

Now try clicking on the _Hello DOM!_ `<h1>` element.  You should see the event being logged:

![The logged event]({{<static "images/1.4.4.png">}})

We can also remove event listeners with [EventTarget.removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) and trigger them programmatically with [EventTarget.dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent).

## Querying the DOM
While we can use the properties of a node to walk the DOM tree manually, this can result in some very ugly code.  Instead, the [Document](https://developer.mozilla.org/en-US/docs/Web/API/document) object provides a number of methods that allow you to search the DOM tree for a specific value.  For example:

* [Document.getElementsByTagName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName) returns a list of elements with a specific tag name, i.e. `document.getElementsByTagName('p')` will return a list of all `<p>` elements in the DOM.
* [Document.getElementsByClassName](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName) returns a list of elements with a specific name listed in its class attribute, i.e. `document.getElementsByClassName('banner')` will return a list containing the `<div.banner>` element.
* [Document.getElementById](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) returns a single element with the specified id attribute.

In addition to those methods, the Document object also supplies two methods that take a CSS selector.  These are:

* [Document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) which returns the first matching element in the DOM.
* [Document.querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) which returns a list of all matching elements.

Let's try selecting the `<h1>` tag using the `querySelector` method:

```js
> var header = document.querySelector('h1');
```

Much easier than `document.body.firstElementChild.firstElementChild` isn't it?

## Manipulating DOM Elements

All HTML elements in the DOM also implement the [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) interface, which also provides acccess to the element's attributes and styling.  So when we retrieve an element from the DOM tree, we can modify these.

Let's tweak the color of the `<h1>` element we saved a reference to in the `header` variable:

```js
> header.style.color = 'blue';
```

This will turn the header blue:

![The blue header]({{<static "images/1.4.5.png">}})

All of the CSS properties can be manipulated through the `style` property.  

In addition, we can access the element's `classList` property, which provides an `add()` and `remove()` methods that add/remove class names from the element.  This way we can define a set of CSS properties for a specific class, and turn that class on and off for an element in the DOM tree, effectively applying all those properties at once.

## Modifying the DOM 

We can create new elements with the [Document.createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) method.  It takes the name of the new tag to create as a string, and an optional options map (a JavaScript object).  Let's create a new `<p>` tag.  In the console:

```js
> var p = document.createElement('p');
```

Now let's give it some text:

```js
> p.textContent = "Tra-la-la";
```

Up to this point, our new `<p>` tag isn't rendered, because it isn't part of the DOM tree.  But we can use the [Node.appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild) method to add it to an existing node in the tree.  Let's add it to the `<div.banner>` element.  Type this command into the console:

```js
document.querySelector('div.banner').appendChild(p);
```

As soon as it is appended, it appears on the page:

![The new p element]({{<static "images/1.4.6.png">}})

Note too that the CSS rules already in place are automatically applied!