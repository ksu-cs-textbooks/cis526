---
title: "Modules"
pre: "4. "
weight: 40
date: 2018-08-24T10:53:26-05:00
---

One major feature Node introduced to JavaScript was the ability to encapsulate code into separate files using _modules_.  The approach adopted by Node is the  __CommonJS__ module pattern. 

{{% notice warning %}}
Node's use of modules predates ECMA6's adoption of modules, and the CommonJS approach Node adopted is fundamentally different than the ECMA6 version.  For Node 10 (installed on your Codio Box), ECMA6 modules are an experimental feature that has to be enabled with a flag when invoking the node command, i.e.:

```text 
$ node --experimental-modules [file to run]
```

In later versions of Node (12-14) ECMA6 modules can be used without the flag by the module file the _.mjs_ extension.  However, this approach is still considered experimental.

{{% /notice %}}

## Writing a Module 
A module is simply a JavaScript file (typically saved with a _js_ extension).  Code within the module is locally scoped to the module; code intended to be accessed outside of the module must be explicitly _exported_ by assigning it to the `module.exports` parameter.  This example exports a function to print "Hello World":

```js
/* hello.js */

function helloWorld() {
  console.log("Hello World");
}

module.exports = helloWorld;
```

You can export a value, function, or object from a module.  If you don't specify an export, a module exports `undefined`.

## Loading a Module
CommonJS Modules are loaded using the `require()` function, which loads the JavaScript in the module and returns any exports from the module.  Objects, functions, or even values can be exported, i.e. this example loads our earlier module, assigns the result to the variable greet, and invokes it:

```js 
var greet = require('./hello');
greet();
```

This example will print "Hello World" to the console.

There are three kinds of modules you can load in Node: 1) core libraries, 2) npm packages, and 3) user-authored modules.

Core libraries are part of Node.  Examples are the _fs_ (file system) library, the _http_ library, and the _crypto_ library.  A full list of libraries can be found in the [Node documentation](https://nodejs.org/api/). Node libraries are required using their name as as the argument, i.e. `require('fs')` will require the filesystem library.

Npm packages are typically open-source libraries created by the community and are downloaded using the Node Package Manager (npm).  These are installed either globally, or within a _node_modules_ folder created by npm within your project.  Npm modules are required by thier package name, i.e. `require('wepback')` will load the webpack package.  

User-written modules are loaded from the filesystem, and are typically located in your project directory or subdirectories within it.  They are required using the filepath to their file, i.e. `require('./hello.js`).  It is important to use the period-slash (`./`) indicating current directory to distinguish files from npm packages.