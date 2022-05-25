---
title: "Promises"
pre: "7. "
weight: 70
date: 2018-08-24T10:53:26-05:00
---

{{< console >}}

Promises replace the callback mechanism with a JavaScript object, a `Promise`.  In many ways, this is similar to the `XMLHttpRequest` object that is at the heart of [AJAX](<ref "c-js/11-ajax">).  You can think of it as a state machine that is in one of three states: _pending_, _fulfilled_, or _rejected_.  

A promise can be created by wrapping an asynchronous call within a new `Promise` object.  For example, we can turn a `setTimeout()` into a promise with:

```js
var threeSecondPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Timer elapsed");
    }, 300);
});
```

We can also create a promise that immediately resolves using `Promise.resolve()`, i.e.:

```js
var fifteenPromise = Promise.resolve(15);
```

This promise is never in the _pending_ state - it starts as _resolved_.  Similarly, you can create a promise that starts in the _rejected_ state with `Promise.reject()`:

```js
var failedPromise = Promise.reject("I am a failure...");
```

You can also pass an error object to `Promise.reject()`.

#### Using Promise.prototype.then()

What makes promises especially useful is their `then()` method.  This method is invoked when the promise finishes, and is passed whatever the promise resolved to, i.e. the string `"Timer elapsed"` in the example above.  Say we want to log that result to the console:

```
threeSecondPromise.then(result => {console.log(result)});
```

This is a rather trivial example, but we can use the same approach to define a _new_ method for creating timers that might seem more comfortable for object-oriented programmers:

```js
function createTimer(milliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}
```

With this method, we can create a timer to do any arbitrary action, i.e.:

```js
// Say "Hello Delayed World" after five seconds
createTimer(5000).then(() => console.log("Hello delayed World!"));
```

#### Using Promise.prototype.catch()

In addition to the `then()` method, promises also provide a `catch()` method.  This method handles any errors that were thrown by the promise.  Consider this function that returns a promise to compute an average:

```js
function computeAverage(numbers)
{
    return new Promise((resolve, reject) => {
        // Sum the numbers
        var sum = numbers.reduce((acc, value) => acc + value);
        // Compute the average 
        var average = sum / numbers.length;
        resolve(average);
    });
}
```

Try copying this code into the console, and then run some examples, i.e.:

```js
computeAverage([1, 3, 5]).then(average => console.log("The average is", average));
```

```js
computeAverage([0.3, 8, 20.5]).then(average => console.log("The average is", average));
```

But what if we use the _empty array_?

```js
computeAverage([]).then(average => console.log("The average is", average));
```

Because the length of the empty array is 0, we are dividing by 0, and an error will be thrown.  Notice the error message reads "Uncaught (in promise)"... we can use the `catch()` method to capture this error, i.e.:

```js
computeAverage([])
    .then(average => console.log("The average is", average))
    .catch(err => console.error("Encountered an error:", err));
```

{{% notice info %}} 
Note when chaining JavaScript method calls, our dot `.` can be separated from the object it belongs to by whitespace.  This can help keep our code readable by putting it on multiple lines.
{{% /notice %}}

Now when we run this code, the error is handled by our `catch()`.  We're still printing it to the console as an error - but notice the message now reads `"Encountered an error" ...`, i.e. it's _our_ error message!

Let's try one more - an array that _cannot_ be averaged, i.e.:

```js
computeAverage(['A', 'banana', true])
    .then(average => console.log("The average is", average))
    .catch(err => console.error("Encountered an error:", err));
```

Here we see the promise resolves successfully, but the result is `NaN` (not a number).  This is because that is the normal result of this operation in JavaScript.  But what if we want that to be treated as an error?  That's where the `reject()` callback provided to the promise comes in - it is used to indicate the promise should fail.  We'll need to rewrite our `computeAverage()` method to use this:

```js
function computeAverage(numbers)
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

Rejected promises are also handled by the `catch()` method, so if we rerun the last example:

```js
computeAverage(['A', 'bannana', true])
    .then(average => console.log("The average is", average))
    .catch(err => console.error("Encountered an error:", err));
```

Notice we now see our error message!

#### Chaining Promise.prototype.then() and Promise.prototype.catch()

Where `Promise.prototype.then()` and `Promise.prototype.catch()` really shine is when we _chain_ a series of promises together.  Remember our callback hell example?

```js
webapp.get('/login', (req, res) => {
    parseFormData(req, res, (form) => {
        var username = form.username;
        var password = form.password;
        findUserInDatabase(username, (user) => {
            encryptPassword(password, user.salt, (hash) => {
                if(hash === user.passwordHash) 
                    res.setCookie({user: user});
                    res.end(200, "Logged in successfully!");
                else
                    res.end(403, "Unknown username/password combo");
            });
        });
    });
});
```

If each of our methods returned a promise, we could re-write this as:

```js
webapp.get('/login', (req, res))
    .then(parseFormData)
    .then(formData => {
        var username = formData.username;
        var password = formData.password;
        return username;
    })
    .then(findUserInDatabase)
    .then(user => {
        return encryptPassword(password, user.salt);
    })
    .then(hash => {
        if(hash === user.passwordHash)
            res.setCookie({user: user});
            res.end(200, "Logged in successfully");
        else 
            res.end(403, "Unknown username/password combo");
    })
    .catch(err => {
        res.end(500, "A server error occurred");
    });
```

{{% notice info %}}
The `Promise.prototype.catch()` method catches any error or promise rejection that occurs before it in the chain - basically as soon as an error or rejection occurs, further `.then()` calls are skipped until a `.catch()` is encountered.  You can also chain additional `.then()` calls after a `.catch()`, and they will be processed until another error or rejection occurs!
{{% /notice %}}


#### Promise.All()
In addition to processing promises in serial (one after another) by chaining `.then()` methods, sometimes we want to do them in _parallel_ (all at the same time).  For example, say we have several independent processes (perhaps each running on a webworker or separate Node thread) that when finished, we want to average together. 

The `Promise.All()` method is the answer; it returns a promise to execute an arbitrary number of promises, and when all have finished, it itself resolves to an array of their results.

Let's do a quick example using this method.  We'll start by declaring a function to wrap a fake asynchronous process - basically creating a random number (between 1 and 100) after a random number of seconds (between 0 and 3):

```js
function mockTask() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var value = Math.ceil(Math.random()*100);
            console.log("Computed value", value);
            resolve(value);
        }, Math.random() * 3000)
    });
}
```

Now let's say we want to compute an average of the results once they've finished.  As `Promise.All()` returns a `Promise` that resolves to a an array of the results, we can invoke our `computeAverage()` (which we declared previously) in a chained `.then()`:


```js
Promise.all([
    mockTask(),
    mockTask(),
    mockTask(),
    mockTask()
])
.then(computeAverage)
.then(console.log);
```

Note that because `computeAverage` takes as a parameter an array, and `console.log` takes as its parameter a value, and those are what the previous promises resolve to, we don't have to define anonymous functions to pass into `.then()` - we can pass the function name instead.

Many JavaScript programmers found this format more comfortable to write and read than a series of nested callbacks.  However, the `async` and `await` syntax offers a _third_ option, which we'll look at next.