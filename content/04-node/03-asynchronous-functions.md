---
title: "Asynchronous Functions"
pre: "3. "
weight: 30
date: 2018-08-24T10:53:26-05:00
---
The benefit of the asynchronous approach is that all user-written code runs in a single-threaded environment while avoiding blocking.  This means for the most part, we can write code the way we are used to, with a few tweaks for asynchronous functions.

Consider the two approaches for reading and printing the contents of a file, below:

```js
const fs = require('fs');

// Synchronous approach
var data = fs.readFileSync('file.txt');
console.log(data);


// Asynchronous approach
fs.readFile('file.txt', function(err, data){
  console.log(data);
});
```

In the synchronous function, the contents of the file are _returned_, and assigned to the variable `data`.  Conversely, in the asynchronous approach the file contents are passed into a _callback_ function that is invoked when the asynchronous process finishes (and when the callback phase of the Node event loop is reached).  The function itself returns nothing (`undefined` in Node).  The important difference between the two is in the first approach, the program waits for the file to be read.  In the second, the program keeps executing lines of code after the asynchronous call, even though the file hasn't been read yet. 

## Asynchronous Callback Structure 
In most Node libraries, the callback function provided to the asynchronous function follows the same format - the first parameter is an error value, which will be populated with text or object if an error occurred, and otherwise will be a __falsy__ value (a value that evaluates to false, like `false`, `null`, `undefined`, or `0`). Successive arguments are the data the function was intended to retrieve - i.e. the contents of the file in the above example.  Of course, if an error _was_ encountered, the later values may be wrong. Thus, most programmers follow the pattern of checking for an error at the start of the callback, and halting execution if one is encountered.  Rewriting the example above, we would see:

```js
fs.readFile("file.txt", function(err, data){
  if(err) return console.error(err); 
  console.log(data);
});
```

If `err` is a __truthy__ value (any non-falsy value, in this case an Exception object or a string), we log the error to the console and return, halting execution of the rest of the function.

## Common Asynchronous Misconceptions
It is very important to understand that the callback is _executed at a future point in time_, and execution continues to further lines of code. Consider this example:

```js
var contents;
fs.readFile("example.txt", function(err, data) {
  contents = data;
});
console.log(data);
```

Assuming the file _example.txt_ contains only the line `"hello world"`, what do you think is printed?

You might think that it would be `"hello world"`, but the `console.log(data)` happens _before_ the callback function is executed, so it will be `undefined`.  If you wanted to print the file contents, you would have to instead do something like:

```js
var contents;
fs.readFile("example.txt", function(err, data) {
  contents = data;
  console.log(data);
});
```

Because the logging now happens _inside_ the callback value, it will only occur _after_ the file has been read, and the results added to the event queue, which is where the `data` variable is initialized.

{{% notice info %}}
[Promises]({{<ref "03-asynchronous-js/07-promises">}}) and the [async/await]({{<ref "03-asynchronous-js/08-async-await">}}) keywords covered in the previous chapter are both attempts to sidestep these misconceptions by introducing new objects and syntax that provide more familiar abstractions to programmers.
{{% /notice %}}