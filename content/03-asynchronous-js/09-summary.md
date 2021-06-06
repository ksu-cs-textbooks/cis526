---
title: "Summary"
pre: "9. "
weight: 90
date: 2018-08-24T10:53:26-05:00
---
In this chapter we learned about many of the approaches and challenges involved in concurrent programming, including _asynchronous_ programming.  JavaScript adopts the asynchronous approach through its use of the event loop and queue, allowing asynchronous processes to be invoked, processed on separate threads, and posting their results as new messages on the event queue to be processed when the main thread gets to them.

We saw how this approach allows for multi-threaded programs in the browser through the use of web workers, each of which runs a separate JavaScript interpreter with its own event loop and queue.  We also saw how communication between web workers and the main thread are handled through message passing, and how very large data buffers can be transferred instead of copied between these threads for efficiency.

Finally, we examined the callback mechanism used for asynchronous processing in JavaScript, and explored two common abstractions used to make it more programmer-friendly: promises and the async/await keywords.  

In the next chapter, we'll explore Node.js, a server-side implementation of the JavaScript engine that makes heavy use of the JavaScript asynchronous model.