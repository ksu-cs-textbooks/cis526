---
title: "Asynchronous Programming"
pre: "4. "
weight: 40
date: 2018-08-24T10:53:26-05:00
---
In asynchronous programming, memory collisons are avoided by not sharing memory between threads.  A unit of work that can be done in parallel is split off and handed to another thread, and any data it needs is copied into that threads' memory space.  When the work is complete, the second thread notifies the primary thread if the work was completed succesfully or not, and provides the resulting data or error.  

In JavaScript, this notification is pushed into the event queue, and the main thread processes it when the event loop pulls the result off the event queue.  Thus, the only memory that is shared between the code you've written in the Event Loop and the code running in the asynchronous process is the memory invovled in the event queue.  Keeping this memory thread-safe is managed by the JavaScript interpreter.  Thus, the code you write (which runs in the Event Loop) is essentially single-threaded, even if your JavaScript application is using some form of parallel processing!

Let's reconsider a topic we've already discussed with this new understanding - timers.  When we invoke `setTimer()`, we are creating a timer that is managed asynchronously.  When the timer elapses, it creates a timer 'event' and adds it to the event queue.  We can see this in the diagram below.

![The timer and event loop]({{<static "images/3.4.1.png">}})

However, the timer is not actually an _event_, in the same sense that a `'click'` or `'keydown'` event is... in that those events are provided to the browser from the operating system, and the browser passes them along into the JavaScript interpreter, possibly with some transformation.  In contrast, the timer is created from within the JavaScript code, though its triggering is managed asycnhronously.

In fact, both timers and events reprsent this style of asynchronous processing - both are managed by creating _messages_ that are placed on the event queue to be processed by the interpreter.  But the timer provides an important example of how asynchronous programming works.  Consider this code that creates a timer that triggers after 0 milliseconds:

```js
setTimeout(()=>{
    console.log("Timer expired!");
}, 0);
console.log("I just set a timer.");
```

What will be printed first?  The "Timer expired!" message or the "I just set a timer." message?  You can try running this code in the console.

The answer is that "I just set a timer" will _always_ be printed first, because the second message won't be printed until the event loop pulls the timer message off the queue, and the line printing "I just set a timer" is executed as part of this pass in the event loop.  The `setTimeout()` and `setInterval()` functions are what we call _asynchronous_ functions, as they trigger an asynchronous process.  Once that process is triggered, execution immediately continues within the event loop, while the triggered process runs in parallel.  Asynchronous functions typically take a function as an argument, known as a _callback function_, which will be triggered when the message corresponding to the asynchronous process is pulled off the event queue.

{{% notice warning %}}
Any code appearing after a call to an asynchronous function will be executed immedately after the asynchonous function is invoked, regardless of how quickly the asynchronous process generates its message and adds it to the event queue.
{{% /notice %}}

As JavaScript was expanded to take on new functionality, this asynchronous mechanism was re-used.  Next, we'll take a look at an example of this in the use of AJAX to make HTTP and HTTPS requests.

{{< console >}}