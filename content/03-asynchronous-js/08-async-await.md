---
title: "Async and Await"
pre: "8. "
weight: 80
date: 2018-08-24T10:53:26-05:00
---

The `async` and `await` keywords are probably more familiar to you from languages like C#.  JavaScript introduced them to play much the same role - a function declared `async` is asynchronous, and returns a `Promise` object.  

With this in mind, we can redeclare our `createTimer()` method using the `async` keyword:

```js
async function createTimer(milliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}
```

Now, instead of using the promise directly, we can use the `await` keyword in other code to wait on the promise to resolve, i.e.:

```js
await createTimer(4000);
console.log("Moving on...");
```

Try running this in the console.  Notice that the second line is not executed until the timer has elapsed after 4 seconds!

Similarly, if we need to use a value computed as part of an asynchronous process, we can place the `await` within the assignment.  I.e. to reproduce the `Promise.All()` example in the previous section, we could re-write our `mockTask()` and `computeAverage()` as `async` functions:

```js
async function mockTask() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var value = Math.ceil(Math.random()*100);
            console.log("Computed value", value);
            resolve(value);
        }, Math.random() * 3000)
    });
}

async function computeAverage(numbers)
{
    return new Promise((resolve, reject) => {
        // Sum the numbers
        var sum = numbers.reduce((acc, value) => acc + value);
        // Compute the average
        var average = sum / numbers.length;
        if(isNaN(average)) reject("Average cannot be computed.");
        else resolve(average);
    });
}
```

And then the code to perform the averaging could be written:

```js
var numbers = [];
numbers.push(await mockTask());
numbers.push(await mockTask());
numbers.push(await mockTask());
numbers.push(await mockTask());
var average = await computeAverage(numbers);
console.log(average);
```

Many imperative programmers prefer the `async` and `await` syntax, because execution of the code pauses at each `await`, so code statements are executed in the order they appear in the code.  However, the actual execution model it is _still_ the event-based concurrency that we introduced with callbacks.  Thus, when awaiting a result, the JavaScript interpreter is free to process other incoming events pulled off the event loop.