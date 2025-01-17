---
title: "Convert to ES Modules"
pre: "3. "
weight: 30
---

{{< youtube id >}}

## CommonJS vs ES Modules

By default, the Express application generator creates an application using the [CommonJS module format](https://nodejs.org/api/modules.html#modules-commonjs-modules). This is the original way that JavaScript modules were packaged. However, many libraries and frameworks have been moving to the new [ECMAScript module format](https://nodejs.org/api/esm.html) (commonly referred to as ES modules), which is current official standard way of packaging JavaScript modules.

Since we want to build an industry-grade application, it would be best to update our application to use the new ES module format. This format will become more and more common over time, and many dependencies on npm have already started to shift to only supporting the ES module format. So, let's take the time now to update our application to use that new format before we go any further.

## Enabling ES Module Support

To enable ES module support in our application, we must simply add `"type": "module",` to the `package.json` file:

```json {hl_lines="4", title="package.json"}
{
  "name": "example-project",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.7",
    "debug": "~4.4.0",
    "express": "~4.21.2",
    "morgan": "~1.10.0"
  }
}
```

Now, let's try to run our application:

```bash {title="terminal"}
$ npm start
```

When we do, we'll get some errors:

``` {title="output"}
> example-project@0.0.1 start
> node ./bin/www

file:///workspaces/example-project/server/bin/www:7
var app = require('../app');
          ^

ReferenceError: require is not defined in ES module scope, you can use import instead
    at file:///workspaces/example-project/server/bin/www:7:11
    at ModuleJob.run (node:internal/modules/esm/module_job:271:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:547:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:116:5)

Node.js v22.12.0
```

By changing that one line in `package.json`, the Node.js runtime is trying to load our project using ES modules instead of CommonJS modules, and it causes all sorts of errors. Thankfully, most of them are easy to fix! In most cases, we are simply making two updates:

1. Replacing `require` statements with `import` statements
2. Replacing `module.exports` statements with `export default` statements. 

Let's go file by file and make these updates. We'll only show the lines that are commented out and their replacements directly below - you'll need to look carefully at each file, find the commented line, and replace it with the new line. 

* `bin/www`

```js {title="bin/www"}
// var app = require('../app');
import app from '../app.js';

// var debug = require('debug')('server:server');
import debugLibrary from 'debug';
const debug = debugLibrary('server:server');

// var http = require('http');
import http from 'http';
```

* `app.js`

```js {title="app.js"}
// var express = require('express');
import express from 'express';

// var path = require('path');
import path from 'path';

// var cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';

// var logger = require('morgan');
import logger from 'morgan';

// var indexRouter = require('./routes/index');
import indexRouter from './routes/index.js';

// var usersRouter = require('./routes/users');
import usersRouter from './routes/users.js';

// -=-=- other code omitted here -=-=-

//module.exports = app;
export default app;
```

* `routes/index.js` and `routes/users.js`

```js {title="routes/index.js & routes/users.js"}
// var express = require('express');
import express from 'express';

// var router = express.Router();
const router = express.Router();

// -=-=- other code omitted here -=-=-

// module.exports = router;
export default router;
```

At this point, let's test our application again to see if we've updated everything correctly:

```bash {title="terminal"}
$ npm start
```

Now, we should get an error message similar to this:

``` {title="output"}
file:///workspaces/example-project/server/app.js:25
app.use(express.static(path.join(__dirname, 'public')));
                                 ^

ReferenceError: __dirname is not defined in ES module scope
    at file:///workspaces/example-project/server/app.js:25:34
    at ModuleJob.run (node:internal/modules/esm/module_job:271:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:547:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:116:5)

Node.js v22.12.0
```

This is a bit trickier to debug, but a quick Google search usually leads to the correct answer. In this case, the `__dirname` variable is a global variable that is defined when Node.js is running a CommonJS module, as discussed in the [documentation](https://nodejs.org/docs/latest/api/modules.html#__dirname). However, when Node.js is running an ES module, many of these global variables have been relocated to the `import.meta` property, as shown in the [documentation](https://nodejs.org/api/esm.html#importmetadirname). So, we can just replace `__dirname` with the `import.meta.dirname` variable in `app.js`:

```js {title="app.js"}
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(import.meta.dirname, 'public')));
```

Let's try to run our application again - it should be able to start this time:

```bash {title="terminal"}
$ npm start
```

Updating a Node.js application to use ES modules is not terribly difficult, especially if it is done early in development. However, since we've made this change, we'll have to be careful as we continue to develop our application. Many online tutorials, documentation, and references assume that any Node.js and Express application is still using CommonJS modules, so we may have to translate any code we find to match our new ES module setup. 

This is a good point to **commit and push** our work!

## References

* [From CommonJS to ES Modules: How to modernize your Node.js app](https://electerious.medium.com/from-commonjs-to-es-modules-how-to-modernize-your-node-js-app-ad8cdd4fb662)