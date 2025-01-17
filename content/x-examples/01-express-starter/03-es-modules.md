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

```json {hl_lines="4"}
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

```bash
$ npm start
```

When we do, we'll get some errors:

```
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

By changing that one line in `package.json`, the Node.js runtime is trying to load our project using ES modules instead of CommonJS modules, and it causes all sorts of errors. Thankfully, most of them are easy to fix! Let's go file by file and make these updates.

* `/bin/www`



## References

* [From CommonJS to ES Modules: How to modernize your Node.js app](https://electerious.medium.com/from-commonjs-to-es-modules-how-to-modernize-your-node-js-app-ad8cdd4fb662)