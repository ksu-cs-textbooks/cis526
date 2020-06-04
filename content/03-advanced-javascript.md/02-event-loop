---
title: "The Event Loop"
pre: "2. "
weight: 20
date: 2018-08-24T10:53:26-05:00
---

Node adopts an asynchronous event-driven approach to computing, much like JavaScript does in the browser.  For example, when we set up a HTTP server in Node, we define a function to call when a HTTP request (an event) is received.  As requests come in, they are added to a queue which is processed in a FIFO (first-in, first-out) manner.  

![JavaScript Event Loop](.guides/img/browser-event-loop.png)

In addition to events, Node implements many asynchronous functions for potentially blocking operations.  For example, consider file I/O.  If you write a program that needs to read a file, but when it attempts to do so the file is already open in another program, your program must wait for it to become available.  In the meantime, your program is _blocked_, and its execution pauses.  A real-world analogue would be a checkout line at a store.  If the cashier is ringing up a customer and finds an item without a price tag, they may leave their station to go find the item on the shelves.  While they are away, the line is _blocked_, everyone in line must wait for the cashier to return.

There are two basic strategies to deal with potentially blocking operations - multi-threading and asynchronous processing.  A multi-threading strategy involves parallelizing the task; in our store example, we'd have additional cash registers, cashiers, and lines.  Even if one line is blocked, the others continue to ring up customers.  In contrast, asynchronous processing moves the potentially blocking task into another process, and continues with the task at hand.  When the asynchronous process finishes, it queues its results for the main process to resume.  In our store example, this would be the cashier sending another employee to find the price, suspending the sale on the register, and continuing to check out other customers while the first customer waits. When the other employee returns with a price, the cashier finishes checking out the current customer, then resumes the first customer's transactions.

Node uses this asynchronous model to handle most potentially blocking operations (and often provides a synchronous approach as well).  When possible, the asynchronous process is handled by the operating system, but the Node runtime also maintains a pool of threads to farm tasks out to.  

The Node event loop is divided into a series of phases - each queues the associated kinds of events and processes them in a round-robin fashion.  This helps ensure that one kind of event can't overwhelm the system:

![JavaScript ](.guides/img/node-event-loop.png)

For a more detailed breakdown of the Node event loop, check out [this blog post](https://medium.com/the-node-js-collection/what-you-should-know-to-really-understand-the-node-js-event-loop-and-its-metrics-c4907b19da4c) by Daniel Khan or the [Node Event Loop Documentation](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/).
