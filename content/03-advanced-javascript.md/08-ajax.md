---
title: "AJAX"
pre: "8. "
weight: 80
date: 2018-08-24T10:53:26-05:00
---
Asynchronous JavaScript and XML (AJAX) is a term coined by Jesse James Garrett to describe a technique of using the [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) object to request resources directly from JavaScript.  As the name implies, this was originally used to request XML content, but the technique can be used with any kind of data.

The `XMLHttpRequest` object is modeled after how the `window` object makes web requests.  You can think of it as a state machine that can be in one of several possible states: 

* **UNSENT** The client has been created, but no request has been made.  Analogus to a just-opened browser before you type an address in the address bar.
* **OPENED** The request has been made, but the response has not been recieved.  The browser analogue would be you have just pressed enter after typing the address.
* **HEADERS_RECIEVED** The first part of the response has been processed.  We'll talk about headers in the next chapter.
* **LOADING** The content of the response is being downloaded.  In the browser, this would be the stage where the HTML is being recieved and parsed into the DOM.
* **DONE** The resource is fully loaded.  In the DOM, this would be equivalent to the `'load'` event.

We can build an AJAX request to retrieve any kind of file from the Internet.  For example, to load the smile image we discussed in the last section, we could use:

```js
var xhr = new XMLHttpRequest();
xhr.addEventListener('load', function(event){
    console.log(xhr.response);
});
xhr.open("GET", "smile.png");
xhr.send();
```