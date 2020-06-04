---
title: "JavaScript Events"
pre: "5. "
weight: 50
date: 2018-08-24T10:53:26-05:00
---

It should be no surpise that JavaScript features events - after all, we've already seen how the [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) interface allows us to attach event listeners to elements in the DOM tree.  What might not be clear yet is how events are handled by JavaScript.  JavaScript uses an _event loop_ to process events.  This is similar to Windows and other operating systems also handle events. 

An event loop expressed in code looks something like:

```
function main
    initialize()
    while message != quit
        message := get_next_message()
        process_message(message)
    end while
end function
```

It's basically an infinite loop that responds to messages, one message at a time.  It might be more useful to see a visual respresentation:

![The JS Event Loop]({{<static "images/1.6.1.png">}})

Here we see not just the event loop, but also the _event queue_.  This is a queue that holds events until the event loop is ready to process them.  It works like the first-in-first-out queues you built in your data structures course (although it may also consider priorities of events).  

On the far right are some commoon sources for JavaScript events - user input, the network, and timers.  These are often managed by the operating system, and with modern multiple-processor computers can happen _concurrently_, i.e. _at the same time_.  This is one reason the queue is so important - it allows JavaScript to process the events _one at a time_.  

When the JavaScript VM has finished executing its current work, it pulls the next event from the event queue.  This event is processed by the corresponding _event listener_ function that either 1) you wrote, or 2) is the default action.  If neither exists, the event is discarded.

### An Example

Consider when the user clicks on a link on your page, let's say `<a id="demo" href="https://google.com">Google it!</a>`.  This creates a 'click' event for the `<a>` tag clicked on.  Now let's assume you've written an event handler and attached it to that anchor tag:

```js
document.getElementById('demo').addEventListener('click', function(e) {
    e.preventDefault();
    alert('You clicked the "Google it!" link.');
});
```

The anonymous function `function(e) {...}` attached to the `<a>`'s 'click' event is invoked, with the event details being passed as the parameter `e`.  Anchor tags have a default behavior - they open the linked page.  So the line `e.preventDefault();` informs JavaScript _not_ to use this default behavior.  Then we trigger an alert with the string `'You clicked the "Google it!" link.'`.

If we hadn't attached the event listener, then the page would have used the default response - loading a new page into the browser in the place of our current page.

If we clicked on an element that didn't have a default action (like a `<p>` element) and you haven't attached a listener the event is discarded and does nothing.

### Concurrency in JavaScript

An important takeaway from the discussion of the event loop is that the actual processing of JavaScript code is always _single-threaded_.  This avoids many of the common challenges of multi-threaded code.  You don't need to create semaphores, locks, and other multi-threading synchronization tools as your code will always be executing in a single thread.

However, JavaScript _does_ retain many of the benefits of concurrency within its model.  For example, when the DOM is loading and encounters an element referencing an external resource (i.e. a `video`, `img`, `link`, or `script` element), it triggers a request to retrieve that resource through the browser.  The browser does so _while the JavaScript code continues executing_.  When the resource is fully downloaded by the browser, it creates a `'load'` event with the details, and adds it to the JavaScript event queue.  Multiple files are therefore downloaded _concurrently_, but our JavaScript handles the results one-by-one in a single-threaded manner.

Think of the JavaScript event loop as a busy manager that only works on one thing at a time.  He might send several workers out to get information.  When they return, they form a line in front of his desk and wait patiently.  Once he finishes the task he has been working on, he takes the report from the first worker in line, and starts doing what he needs to do with the returned information.  Once he finishes that, he has the second employee report, and so on.

## Common Events

There are many kinds of events in JavaScript; you can find a complete list in the [mdn docs](https://developer.mozilla.org/en-US/docs/Web/Events).  However some of the ones you will likely find yourself using are:

* [load](https://developer.mozilla.org/en-US/docs/Web/Events/load) - Triggered when a resource (i.e. an image, video, stylesheet, script) has finished loading.  You can also listen for the load event on the `document` itself; here it will be triggered after _all_ the resources on the page are loaded.

* [change](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event) The value of an `<input>`, `<textarea>`, or `<select>` has changed

* [focus](https://developer.mozilla.org/en-US/docs/Web/Events/focus) triggered when an input gains focus (is the currently selected input)

* [blur](https://developer.mozilla.org/en-US/docs/Web/Events/blur) triggered when an input looses focus

* [click](https://developer.mozilla.org/en-US/docs/Web/Events/click) The primary mouse button was clicked.  On old browsers this might trigger for any button

* [contextmenu](https://developer.mozilla.org/en-US/docs/Web/Events/contextmenu) The right mouse button was clicked

* [mousedown](https://developer.mozilla.org/en-US/docs/Web/Events/mousedown) A mouse button was pressed

* [mouseup](https://developer.mozilla.org/en-US/docs/Web/Events/mouseup) A mosue button was released

## Timers

Timers play a special role in JavaScript's concurrency model, and in many ways behave like events.  For example, to cause the phrase "Hello time!" to be logged to the console in three minutes, you would write the code:

```js
setTimeout(function() { console.log("Hello time!")}, 3000);
```

You will notice that the [setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) method takes a function to execute at that future point in time, much like attaching an event handler.  The second argument is the number of milliseconds in the future for this event to occur.  The timer works like an event, when the time expires, a corresponding event is added to the event queue, to trigger the delayed function.  

An important side-effect of this approach is that you only know the timer's result won't happen _before_ the delay you specify, but if the JavaScript vm is engaged in a long-running process, it may be longer before your timer event is triggered.

For events you need to do on a regular interval, use [setInterval()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) instead.  This will invoke the supplied function at each elapsing of the supplied interval.  It also returns a unique id that can be supplied to [clearInterval()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval) to stop the timed event.

{{% notice info %}}

You may find yourself reading code that uses a value of `0` milliseconds with `setTimeout()`, i.e.:

```js
setTimeout(doSomething, 0);
```

You might be wondering why.  You might wonder if it is equivalent to:

```js
doSomething();
```

And while it might appear that way, the answer is _no_.  Remember, `setTimeout()` creates an event in the event queue that executes after the specificed delay.  Thus, `doSomething()` will execute _immediately_, but `setTimout(doSomething())` will continue to execute all code _after_ the line until execution finishes, and _then_ will invoke `doSomething()`.  

Thus, JavaScript programmers often use this technique to trigger an action immedately after the current code finishes executing.

{{% /notice %}}