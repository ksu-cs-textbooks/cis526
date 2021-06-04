---
title: "Callbacks"
pre: "6. "
weight: 60
date: 2018-08-24T10:53:26-05:00
---

{{< console >}}

JavaScript implements its asynchronous nature through _callbacks_ - functions that are invoked when an asynchronous process completes.  We see this in our discussion of timers like `setTimeout()` and with our web workers with the `onmessage` event handler.  These demonstrate two possible ways of setting a callback.  With `setTimeout()` we pass the callback as a function parameter, i.e.:

```js
function timeElapsed() {
    console.log("Time has elapsed!");
}
// Set a timer for 1 second, and trigger timeElapsed() when the timer expires
setTimeout(timeElapsed, 1000);
```

With webworkers, we assign a function to a property of the worker (the `onmessage` variable):

```js
function messageReceived(message) {
    console.log("Received " + message);
}
// Set the event listener
onmessage = messageReceived;
```

Remember, a callback is a function, and in JavaScript, functions are first-order: we can assign them as a variable or pass them as an argument to a function!  We can also define a callback asynchronously as part of the argument, as we do here:

```js
setTimeout(function() {
    console.log("time elapsed")
}, 1000);
```

Or using lambda syntax:

```js
setTimeout(() => {
    console.log("time elapsed")
}, 1000);
```

These are roughly equivalent to passing `timeElapsed()` in the first example - and you'll likely see all three approaches when you read others' code.

### Callback Hell
Callbacks are a powerful mechanism for expressing asynchronicity, but overuse can lead to difficult to read code - a situation JavaScript programmers refer to as "callback hell".  This problem became especially pronounced once programmers began using Node to build server-side code, as Node adopted the event-based callback asynchronous model of JavaScript for interactions with the file system,databases, etc. (we'll cover Node in the [next chapter]({{<ref "04-node">}})). 

Consider this example, which logs a user into a website:

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

Don't work about the exact details of the code, but count the number of nested callbacks.  There are four!  And reasoning about this deeply nested code starts getting pretty challenging even for an experienced programmer.  Also, handling errors in this nested structure requires thinking through the nested structure. 

There are strategies to mitigate this challenge in writing your code, including:

1. Keeping your code shallow
2. Modularizing your code 
3. Handling every single error.

The site <a href="http://callbackhell.com">callbackhell.com</a> offers a detailed discussion of these strategies.

As JavaScript matured, additional options were developed for handling this complexity - Promises and the `async` and `await` keywords.  We'll talk about them next.
