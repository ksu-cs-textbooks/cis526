---
title: "Bypass Auth"
pre: "1. "
weight: 10
---

{{< youtube NjrWPg41_B4 >}}

## Authentication Libraries

There are many different authentication libraries and methods available for Node.js and Express. For this project, we will use the [Passport.js](https://www.passportjs.org/) library. It supports many different authentication strategy, and is a very common way that authentication is handled within JavaScript applications.

For our application, we'll end up using several strategies to authenticate our users:

* [Unique Token](https://www.passportjs.org/packages/passport-unique-token/) - used to bypass authentication for testing
* [CAS](https://github.com/appdevdesigns/passport-cas) - used to authenticate with [Central Authentication Service (CAS)](https://apereo.github.io/cas/7.1.x/index.html) servers such as those used at K-State
* [JSON Web Tokens (JWT)](https://www.passportjs.org/packages/passport-jwt-cookiecombo/) - used to identify user requests to the API itself

Let's first set up our unique token strategy, which allows us to test our authentication routes before setting up anything else.

## Authentication Router

First, we'll need to create a new route file at `routes/auth.js` to contain our authentication routes. We'll start with this basic structure and work on filling in each method as we go.

```js {title="routes/auth.js"}
/**
 * @file Auth router
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: auth
 *   description: Authentication Routes
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     AuthToken:
 *       description: authentication success
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: a JWT for the user
 *             example:
 *               token: abcdefg12345
 */

// Import libraries
import express from "express";
import passport from "passport";

// Import configurations
import "../configs/auth.js";

// Create Express router
const router = express.Router();

/**
 * Authentication Response Handler
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authSuccess = function (req, res, next) {

};

/**
 * Bypass authentication for testing
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /auth/bypass:
 *   get:
 *     summary: bypass authentication for testing
 *     description: Bypasses CAS authentication for testing purposes
 *     tags: [auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: username
 *     responses:
 *       200:
 *         description: success
 */
router.get("/bypass", function (req, res, next) {

});

/**
 * CAS Authentication
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /auth/cas:
 *   get:
 *     summary: CAS authentication
 *     description:  CAS authentication for deployment
 *     tags: [auth]
 *     responses:
 *       200:
 *         description: success
 */
router.get("/cas", function (req, res, next) {

});

/**
 * Request JWT based on previous authentication
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /auth/token:
 *   get:
 *     summary: request JWT 
 *     description: request JWT based on previous authentication
 *     tags: [auth]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/AuthToken'
 */
router.get("/token", function (req, res, next) {

});

export default router;
```

This file includes a few items to take note of:

* In the top-level Open API comment, we define a new `AuthToken` response that we'll send to the user when they request a token.
* We create three routes. The first two, `/auth/bypass` and `/auth/cas`, for each of our authentication strategies. The last one, `/auth/token` will be used by our frontend to request a token to access the API.
* Finally, we'll build a `authSuccess` function to handle actually sending the response to the user

Before moving on, let's go ahead and add this router to our `app.js` file along with the other routers:

```js {title="app.js" hl_lines="6 13"}
// -=-=- other code omitted here -=-=-

// Import routers
import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api.js";
import authRouter from "./routes/auth.js";

// -=-=- other code omitted here -=-=-

// Use routers
app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/auth", authRouter);

// -=-=- other code omitted here -=-=-
```

We'll come back to this file once we are ready to link up our authentication strategies.

## Unique Token Authentication

Next, let's install both `passport` and the `passport-unique-token` authentication strategy:

```bash {title="terminal"}
$ npm install passport passport-unique-token
```

We'll configure that strategy in a new `configs/auth.js` file with the following content:

```js {title="configs/auth.js"}
/**
 * @file Configuration information for Passport.js Authentication
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import libraries
import passport from "passport";
import { UniqueTokenStrategy } from "passport-unique-token";

// Import models
import { User, Role } from "../models/models.js";

// Import logger
import logger from "./logger.js";

/**
 * Authenticate a user
 * 
 * @param {string} username the username to authenticate
 * @param {function} next the next middleware function
 */
const authenticateUser = function(username, next) {
  // Find user with the username
  User.findOne({ 
    attributes: ["id", "username"],
    include: {
      model: Role,
      as: "roles",
      attributes: ["id", "role"],
      through: {
        attributes: [],
      },
    },
    where: { username: username },
  })
  .then((user) => {
    // User not found
    if (user === null) {
      logger.debug("Login failed for user: " + username);
      return next(null, false);
    }

    // User authenticated
    logger.debug("Login succeeded for user: " + user.username);

    // Convert Sequelize object to plain JavaScript object
    user = JSON.parse(JSON.stringify(user))
    return next(null, user);
  });
}

// Bypass Authentication via Token
passport.use(new UniqueTokenStrategy(
  // verify callback function
  (token, next) => {
    return authenticateUser(token, next);
  }
))

// Default functions to serialize and deserialize a session
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
```

In this file, we created an `authenticateUser` function that will look for a user based on a given username. If found, it will return that user by calling the `next` middleware function. Otherwise, it will call that function and provide `false`. 

Below, we configure Passport.js using the `passport.use` function to define the various authentication strategies we want to use. In this case, we'll start with the [Unique Token Strategy](https://www.passportjs.org/packages/passport-unique-token/), which uses a token provided as part of a query to the web server.

In addition, we need to implement some default functions to handle serializing and deserializing a user from a session. These functions don't really have any content in our implementation; we just need to include the default code.

Finally, since Passport.js acts as a global object, we don't even have to export anything from this file! 

## Testing Authentication

To test this authentication strategy, let's modify `routes/auth.js` to use this strategy. We'll update the `/auth/bypass` route and also add some temporary code to the `authSuccess` function:

```js {title="routes/auth.js" hl_lines="7-8 12 16"}
// -=-=- other code omitted here -=-=-

// Import libraries
import express from "express";
import passport from "passport";

// Import configurations
import "../configs/auth.js";

// -=-=- other code omitted here -=-=-
const authSuccess = function (req, res, next) {
  res.json(req.user);
};

// -=-=- other code omitted here -=-=-
router.get("/bypass", passport.authenticate('token', {session: false}), authSuccess);

// -=-=- other code omitted here -=-=-
```

In the `authSuccess` function, right now we are just sending the content of `req.user`, which is set by Passport.js on a successful authentication (it is the value we returned when calling the `next` function in our authentication strategy earlier). We'll come back to this later when we implement JSON Web Tokens (JWT) later in this tutorial. 

The other major change is that now the `/auth/bypass` route calls the `passport.authenticate` method with the `'token'` strategy specified. It also uses `{session: false}` as one of the options provided to Passport.js since we aren't actually going to be using sessions. Finally, if that middleware is satisfied, it will call the `authSuccess` function to handle sending the response to the user. This takes advantage of the chaining that we can do in Express!

With all of that in place, we can test our server and see if it works:

```bash {title="terminal"}
$ npm run dev
```

Once the page loads, we want to navigate to the `/auth/bypass?token=admin` path to see if we can log in as the `admin` user. Notice that we are including a query parameter named `token` to include the username in the URL. 

![Successful Authentication](/images/examples/04/auth_1.png)

There we go! We see that it successfully finds our `admin` user and returns data about that user, including the roles assigned. This is what we want to see. We can also test this by providing other usernames to make sure it is working. 

## Securing Authentication

Of course, we don't want to have this bypass authentication system available all the time in our application. In fact, we really only want to use it for testing and debugging; otherwise, our application will have a major security flaw! So, let's add a new environment variable `BYPASS_AUTH` to our `.env`, `.env.test` and `.env.example` files. We should set it to `TRUE` in the `.env.test` file, and for now we'll have it enabled in our `.env` file as well, but this option should **NEVER** be enabled in a production setting. 

```env {title=".env"}
# -=-=- other settings omitted here -=-=-
BYPASS_AUTH=true
```

With that setting in place, we can add it to our `configs/auth.js` file to only allow bypass authentication if that setting is enabled:

```js {title="configs/auth.js"}
// -=-=- other code omitted here -=-=-

// Bypass Authentication via Token
passport.use(new UniqueTokenStrategy(
  // verify callback function
  (token, next) => {
    // Only allow token authentication when enabled
    if (process.env.BYPASS_AUTH === "true") {
      return authenticateUser(token, next);
    } else {
      return next(null, false);
    }
  }
))
```

Before moving on, we should make sure we test both enabling and disabling this setting _actually_ disables bypass authentication. We want to be absolutely sure it works as intended!

![Disabled Authentication](/images/examples/04/auth_2.png)