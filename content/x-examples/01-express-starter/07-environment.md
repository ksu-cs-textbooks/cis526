---
title: "Environment"
pre: "7. "
weight: 70
---

{{< youtube RwurcrpXW7g >}}

## Environment Variables

As discussed earlier, an [**environment variable**](https://en.wikipedia.org/wiki/Environment_variable) is a value present in memory in the operating system environment where a process is running. They contain important information about the system where the application is running, but they can also be configured by the user or system administrator to provide information and configuration to any processes running in that environment. This is especially used when working with **containers** like the dev container we built for this project. 

To explore this, we can use the `printenv` command in any Linux terminal:

```bash {title="terminal"}
$ printenv
```

When we run that command in our GitHub codespace, we'll see output containing lines similar to this (many lines have been omitted as they contain secure information):

``` {title="output"}
SHELL=/bin/bash
GITHUB_USER=russfeld
CODESPACE_NAME=laughing-computing-machine-jj5j9p97vx435jqj
HOSTNAME=codespaces-f1a983
RepositoryName=example-project
CODESPACES=true
YARN_VERSION=1.22.22
PWD=/workspaces/example-project/server
ContainerVersion=13
GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN=app.github.dev
USER=node
NODE_VERSION=22.12.0
OLDPWD=/workspaces/example-project
TERM_PROGRAM=vscode
```

As we can see, the environment contains many useful variables, including a `CODESPACES` variable showing that the application is running in GitHub Codespaces. We can also find our `GITHUB_USER`, `CODESPACE_NAME` and even the `NODE_VERSION` all in the environment.

## Configuring the Environment

Because many web applications eventually run in a containerized environment anyway, it is very common practice to configure those applications through the use of environment variables. Thankfully, we can more easily control and configure our application through the use of a special library [dotenvx](https://dotenvx.com/) that allows us to load a set of environment variables from a file named `.env`. 

{{% notice note "dotenv" %}}

The `dotenvx` library is a newer version of the [dotenv](https://www.npmjs.com/package/dotenv) library that has been used for this purpose for many years. `dotenvx` was developed by the same developer, and is often recommended as a new, modern replacement to `dotenv` for most users. It includes features that allow us to create multiple environments and even encrypt values. So, for this project we'll use the newer library to take advantage of some of those features.

{{% /notice %}}

To begin, let's install `dotenvx` using `npm`:

```bash {title="terminal"}
$ npm install @dotenvx/dotenvx
```

Next, we'll need to import that library as early as possible in our application, since we want to make sure that the environment is properly loaded before any other configuration files are referenced, since they may require environment variables to work properly. In this case, we want to do that as the very first thing in `app.js`:

```js {title="app.js", hl_lines="1"}
import '@dotenvx/dotenvx/config';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import requestLogger from './middlewares/request-logger.js';

// -=-=- other code omitted here -=-=-
```

Now, when we run our application, we should get a helpful message letting us know that our environment file is missing:

``` {title="output"}
> example-project@0.0.1 dev
> LOG_LEVEL=debug nodemon ./bin/www

[nodemon] 3.1.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./bin/www`
[MISSING_ENV_FILE] missing .env file (/workspaces/example-project/server/.env)
[MISSING_ENV_FILE] https://github.com/dotenvx/dotenvx/issues/484
[dotenvx@1.34.0] injecting env (0)
[2025-01-25 08:15:56.135 PM] info:      Listening on port 3000
```

This is one of the many benefits that comes from using the newer `dotenvx` library - it will helpfully remind us when we are running without an environment file, just in case we forgot to create one. 

So, now let's create the `.env` file in the `server` folder of our application, and add an environment variable to that file:

```env {title=".env"}
LOG_LEVEL=error
```

This should set the logging level of our application to **error**, meaning that only errors will be logged to the terminal. So, let's run our application and see what it does:

```bash {title="terminal"}
$ npm run dev
```

However, when we do, we notice that we are still getting **http** logging in the output:

``` {title="output"}
> example-project@0.0.1 dev
> LOG_LEVEL=debug nodemon ./bin/www

[nodemon] 3.1.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./bin/www`
[dotenvx@1.34.0] injecting env (0) from .env
[2025-01-25 08:20:17.438 PM] info:      Listening on port 3000
[2025-01-25 08:23:56.896 PM] http:      GET / 304 3.405 ms -
```

This is because we are already setting the `LOG_LEVEL` environment variable directly in our `package.json` file:

```json {title="package.json" hl_lines="7-8"}
{
  "name": "example-project",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "scripts": {
    "start": "LOG_LEVEL=http node ./bin/www",
    "dev": "LOG_LEVEL=debug nodemon ./bin/www"
  },
  ...
}
```

This is actually a great feature! The `dotenvx` library will not override any existing environment variables - so, if the environment is already configured, or we want to override anything that may be present in our `.env` file, we can just set it in the environment before running our application, and those values will take precedence!

For now, let's go ahead and remove that variable from the `dev` script in our `package.json` file:

```json {title="package.json" hl_lines="8"}
{
  "name": "example-project",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "scripts": {
    "start": "LOG_LEVEL=http node ./bin/www",
    "dev": "nodemon ./bin/www"
  },
  ...
}
```

Now, when we run our program, we should not see any logging output (unless we can somehow cause the server to raise an error, which is unlikely right now):

``` {title="output"}
> example-project@0.0.1 dev
> nodemon ./bin/www

[nodemon] 3.1.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./bin/www`
[dotenvx@1.34.0] injecting env (1) from .env
```

Finally, let's go ahead and set the value in our `.env` file back to the `debug` setting:

```env {title=".env"}
LOG_LEVEL=debug
```

Now, when we run our application, we can see that it is following that configuration:

``` {title="output"}
> example-project@0.0.1 dev
> nodemon ./bin/www

[nodemon] 3.1.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./bin/www`
[dotenvx@1.34.0] injecting env (1) from .env
[2025-01-25 08:28:54.587 PM] info:      Listening on port 3000
[2025-01-25 08:28:58.625 PM] http:      GET / 200 3.475 ms - -
```

Great! We now have a powerful way to configure our application using a `.env` file. 

## Other Environment Variables

Right now, our program only uses one other environment variable, which can be found in the `bin/www` file:

```js {title="bin/www" hl_lines="10"}
#!/usr/bin/env node

import app from '../app.js';
import logger from '../configs/logger.js';
import http from 'http';

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// -=-=- other code omitted here -=-=-
```

The code `process.env.PORT || '3000'` is a commonly used shorthand in JavaScript to check for the presence of a variable. Basically, if `process.env.PORT` is set, then that code will resolve to that value. If not, then the or operator `||` will use the second option, which is the value `'3000'` that is just hard-coded into our application.

So, we can set that value explicitly in our `.env` file:

```env {title=".env"}
LOG_LEVEL=debug
PORT=3000
```

In general, it is always good practice to explicitly list all configurable values in the `.env` file when developing an application, since it helps us keep track of them. 

However, each value should also have a **logical default value** if no configuration is provided. Ideally, our application should be able to run correctly with minimal configuration, or it should at least provide clear errors to the user when a configuration value is not provided. For example, we can look back at the `level()` function in `configs/logger.js` to see that it will set the logging level to `http` if it cannot find an appropriate `LOG_LEVEL` environment variable. 

## Environment Variable Security

Storing the configuration for our application in a `.env` file is a great option, and it is even included as item 3 of the [twelve-factor methodology](https://12factor.net/config) for developing modern web applications.

Unfortunately, this can present one **major security flaw** - often, the information stored in the `.env` file is very sensitive, since it may include database passwords, encryption keys, and more. So, we want to make absolutely sure that our `.env` file is never committed to git or GitHub, and it should never be shared between developers.

We can enforce this by ensuring that our `.gitignore` file inside of our `server` folder includes a line that prevents us from accidentally committing the `.env` file. Thankfully, both the `.gitignore` produced by the Express application generator, as well as the one in the GitHub [gitignore](https://github.com/github/gitignore/blob/main/Node.gitignore) repository both already include that line. 

Instead, it is common practice to create a second file called `.env.example` (or similar) that contains a list of all configurable environment variables, along with safe default values for each. So, for this application, we might create a `.env.example` file that looks like this:

```env {title=".env.example"}
LOG_LEVEL=http
PORT=3000
```

This file can safely be committed to git and stored in GitHub. When a new developer or user clones our project, they can easily copy the `.env.example` file to `.env` and update it to match their desired configuration.

As we continue to add environment variables to our `.env` file, we should also make sure the `.env.example` file is kept up to date.

This is a good point to **commit and push** our work, but be extra sure that our `.env` file **DOES NOT** get committed to git!