---
title: "Cookie Sessions"
pre: "2. "
weight: 20
---

{{< youtube HR3gG-9bwts >}}

## Cookie Sessions

One of the most common methods for keeping track of users after they are authenticated is by setting a cookie on their browser that is sent with each request. We've already explored this method earlier in this course, so let's go ahead and configure cookie sessions for our application, storing them in our existing database.

We'll start by installing both the [express-session](https://www.npmjs.com/package/express-session) middleware and the [connect-session-sequelize](https://www.npmjs.com/package/connect-session-sequelize) library that we can use to store our sessions in a Sequelize database:

```bash {title="terminal"}
$ npm install express-session connect-session-sequelize
```

Once those libraries are installed, we can create a configuration for sessions in a new `configs/sessions.js` file:

```js {title="configs/sessions.js"}
/**
 * @file Configuration for cookie sessions stored in Sequelize
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports sequelizeSession a Session instance configured for Sequelize
 */

// Import Libraries
import session from 'express-session'
import connectSession from 'connect-session-sequelize'

// Import Database
import database from './database.js'
import logger from './logger.js'

// Initialize Store
const sequelizeStore = connectSession(session.Store)
const store = new sequelizeStore({
    db: database
})

// Create tables in Sequelize
store.sync();

if (!process.env.SESSION_SECRET) {
    logger.error("Cookie session secret not set! Set a SESSION_SECRET environment variable.")
}

// Session configuration
const sequelizeSession = session({
    name: process.env.SESSION_NAME || 'connect.sid',
    secret: process.env.SESSION_SECRET,
    store: store, 
    resave: false,
    proxy: true,
    saveUninitialized: false
})

export default sequelizeSession;
```

This file loads our Sequelize database connection and initializes the Express session middleware and the Sequelize session store. We also have a quick sanity check that will ensure there is a `SESSION_SECRET` environment variable set, otherwise an error will be printed. Finally, we export that session configuration to our application.

So, we'll need to add a `SESSION_NAME` and `SESSION_SECRET` environment variable to our `.env`, `.env.test` and `.env.example` files. The `SESSION_NAME` is a unique name for our cookie, and the `SESSION_SECRET` is a secret key used to secure our cookies and prevent them from being modified. 

There are many ways to generate a secret key, but one of the simplest is to just use the built in functions in Node.js itself. We can launch the Node.js [REPL](https://nodejs.org/en/learn/command-line/how-to-use-the-nodejs-repl) environment by just running the `node` command in the terminal:

```bash {title="terminal"}
$ node
```

From there, we can use this line to get a random secret key:

```js {title="node"}
> require('crypto').randomBytes(64).toString('hex')
```

{{% notice info "Documenting Terminal Commands" %}}

Just like we use `$` as the prompt for Linux terminal commands, the Node.js REPL environment uses `>` so we will include that in our documentation. You should not include that character in your command.

{{% /notice %}}

If done correctly, we'll get a random string that you can use as your secret key!

![Secret Key](/images/examples/04/auth_3.png)

We can include that key in our `.env` file. To help remember how to do this in the future, we can even include the Node.js command as a comment above that line:

```env {title=".env"}
# -=-=- other settings omitted here -=-=-
SESSION_NAME=lostcommunities
# require('crypto').randomBytes(64).toString('hex')
SESSION_SECRET=46a5fdfe16fa710867102d1f0dbd2329f2eae69be3ed56ca084d9e0ad....
```

Finally, we can update our `app.js` file to use this session configuration. We'll place this between the `/api` and `/auth` routes, since we only want to load cookie sessions if the user is accessing the authentication routes, to minimize the number of database requests:

```js {title="app.js" hl_lines="10 15 23-25"}
// -=-=- other code omitted here -=-=-

// Import libraries
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import path from "path";
import swaggerUi from "swagger-ui-express";
import passport from "passport";

// Import configurations
import logger from "./configs/logger.js";
import openapi from "./configs/openapi.js";
import sessions from "./configs/sessions.js";

// -=-=- other code omitted here -=-=-

// Use routers
app.use("/", indexRouter);
app.use("/api", apiRouter);

// Use sessions
app.use(sessions);
app.use(passport.authenticate("session"));

// Use auth routes
app.use("/auth", authRouter);

// -=-=- other code omitted here -=-=-
```

There we go! Now we can enable cookie sessions in Passport.js by removing the `{session: false}` setting in our `/auth/bypass` route in the `routes/auth.js` file:

```js {title="routes/auth.js"}
// -=-=- other code omitted here -=-=-
router.get("/bypass", passport.authenticate('token'), authSuccess);

// -=-=- other code omitted here -=-=-
```

Now, when we navigate to that route and authenticate, we should see our application set a session cookie as part of the response.

![Cookie Session](/images/examples/04/auth_7.png)

We can match the SID in the session cookie with the SID in the `Sessions` table in our database to confirm that it is working:

![Cookie Session in Database](/images/examples/04/auth_8.png)

From here, we can use these sessions throughout our application to track users as they make additional requests.