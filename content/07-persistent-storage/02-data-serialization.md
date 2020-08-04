---
title: "Data Serialization"
pre: "2. "
weight: 20
date: 2018-08-24T10:53:26-05:00
---

Perhaps the simplest persistent storage mechanism we can adopt is to use a combination of an in-memory variable and a file.  For example, we could set up a simple database mechanism as a Node module:

```js
const fs = require('fs');

/** @module database 
 * A simple in-memory database implementation, 
 * providing a mechasim for getting and saving 
 * a database object
 */ 
module.exports = { get, set };

// We retrieve and deserialize the database from 
// a file named data.json.  We deliberately don't 
// catch errors, as if this process fails, we want 
// to stop the server loading process
var fileData = fs.readFileSync('data.json');
var data = JSON.parse(fileData);

/** @function get()
 * Returns the database object 
 * @returns {object} data - the data object
 */
function get() {
    return data;
}

/** @function set()
 * Saves the provided object as the database data, 
 * overrwiting the current object
 * @param {object} newData - the object to save 
 * @param {function} callback - triggered after save 
 */
function set(newData, callback) {
    // Here we don't want the server to crash on 
    // an error, so we do wrap it in a try/catch
    try {
        var fileData = JSON.stringify(newData);
        fs.writeFile("data.json", fileData, (err) => {
            // If there was an error writing the data, we pass it 
            // forward in the callback and don't save the changes
            // to the data object
            if(err) return callback(err);
            // If there was no error, we save the changes to the 
            // module's data object (the variable data declared above)
            data = newData
            // Then we invoke the callback to notify of success by sending 
            // a value of null for the error
            callback(null);
        });
    } catch (err) {
        // If we catch an error in the JSON stringification process,
        // we'll pass it through the callback 
        callback(err);
    }
}
```

In this module, we exploit a feature of Node's [require](https://nodejs.org/en/knowledge/getting-started/what-is-require/), in that it _caches_ the value returned by the `require()` function for each unique argument.  So the first time we use `require('./database')`, we process the above code.  Node internally stores the result (an object with the `get()` and `set()` method) in its module cache, and the next time we use `require('./database')` in our program, this object is what is required.  Effectively, you end up using the same `data` variable every time you `require('./database')`.  This is an application of the [Singleton Pattern](https://en.wikipedia.org/wiki/Singleton_pattern) in a form unique to Node.

## Refactoring for Better Error Prevention

While this module can work well, it does suffer from a number of limitations.  Perhaps the most important to recognize is that the `get()` method returns a reference to our aforementioned `data` variable - so if you change the value of the variable, you change it for all future `get()` function calls, while sidestepping the persistent file write embodied in our `set()`.  Instead of providing a reference, we could instead provide a copy.  A simple trick to do so in JavaScript is to serialize and then deserialize the object (turning it into a JSON string and then back into an object).  The refactored `get()` would then look like:

```js
/** @function get()
 * Returns A COPY OF the database object 
 * @returns {object} data - A COPY OF the data object
 */
function get() {
    return JSON.parse(JSON.stringify(data));
}
```

Note that there is a possibility this process can fail, so it really should be wrapped in a `try/catch` and refactored to use a callback to pass on this possible error and the data object:

```js
/** @function get()
 * Provides a copy of the data object
 * @param {function} callback - Provides as the first parameter any errors, 
 * and as the second a copy of the data object.
 */
function get(callback) {
    try {
        var dataCopy = JSON.parse(JSON.stringify(data));
        callback(null, dataCopy);
    } catch (err) {
        callback(err);
    }
}
```

Notice that with this refactoring, we are using the same pattern common to the Node modules we've been working with.  There is a second benefit here is that if we needed to convert our `get()` from a synchronous to asynchronous implementation, our function definition won't change (the `set()` is already asynchronous, as we use the asynchronous `fs.writeFile()`).

## Other Limitations

This database implementation is still pretty basic - we retrieve an entire object rather than just the portion of the database we need, and we write the entire database on every change as well.  If our database gets to be very large, this will become an expensive operation.

There is also a lot of missed opportunity for optmizing how we get the specific data we need.  As you have learned in your algorithms and data structures course, the right search algorithm, coupled with the right data structure, can vastly improve how quickly your program can run.  If we think about the work that a webserver does, the retrieval of data for building dynamic HTML based on it is easily one of the most time-consuming aspects, so optimizing here can make each page creation move much faster.  Faster page creation means shorter response times, and more users served per minute with less processing power.  That, in turn means less electrictiy, less bandwidth, and less hardware is required to run your website.  In heavily utilized websites, this can equate to a lot of savings!  And for websites hosted on elastic hosting services (those that only charge for the resources you use), it can also result in signifcant savings.

Thus, we might want to spend more time developing a robust database program that would offer these kinds of optimizations.  Or, we could do what most full-stack developers do, and use an already existing database program that was designed with these kinds of optimizations in mind.  We'll take a look at that approach next.