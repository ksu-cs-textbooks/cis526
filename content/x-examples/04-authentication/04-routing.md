---
title: "Auth Routing"
pre: "4. "
weight: 40
---

{{< youtube id >}}

## Routing after Authentication

The last step we should take in our authentication system is to properly route users back to the index page after a successful login attempt. Since we will eventually be building a single-page application in Vue.js as our frontend for this application, we only need to worry about directing users back to the index page, which will load our frontend.

So, in our `authSuccess` method in `routes/auth.js`, we can update the response to redirect our users back to the index page:

```js {title="auth/routes.js"}
// -=-=- other code omitted here -=-=-
const authSuccess = function (req, res, next) {
  res.redirect("/");
};

// -=-=- other code omitted here -=-=-
```

The `res.redirect` method will sent an HTTP 302 `Found` response back to the browser with a new location to navigate to. However, by that point, the authentication process will also send a cookie to the browser with the session ID, so the user will be logged in correctly:

![Session Login with Cookie Set](/images/examples/04/auth_9.png)

## Logout Route

Finally, we should also add a logout route. This route will end any sessions created through Passport.js by removing the session from the database and also telling the browser to delete the session cookie. It uses the special `req.logout()` method that is added to each request by Passport.js. We'll add our logout route to the bottom of the `routes/auth.js` file:

```js {title="routes/auth.js" hl_lines="5"}
// -=-=- other code omitted here -=-=-

// Import configurations
import "../configs/auth.js";
import logger from "../configs/logger.js";

// -=-=- other code omitted here -=-=-

/**
 * Logout of a Passport.js session
 * 
 * See https://www.initialapps.com/properly-logout-passportjs-express-session-for-single-page-app/
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: logout current user
 *     description:  logout current user and end session
 *     tags: [auth]
 *     responses:
 *       200:
 *         description: success
 */
router.get('/logout', function (req, res, next) {
  res.clearCookie(process.env.SESSION_NAME || 'connect.sid');  // clear the session cookie
  req.logout(function(err) {       // logout of passport
    if (err) {
      logger.error(err);
    }
    req.session.destroy(function (err) {  // destroy the session
      if (err) {
        logger.error(err);
      }
      res.redirect('/');
    })
  });
})

// -=-=- other code omitted here -=-=-
```

Now, when we access this route with a valid session, we'll see that the user is properly logged out. 

We'll also no longer be able to access the `/auth/token` route without logging in again.

However, this route **WILL NOT** invalidate any existing JWTs already issued to that user - they will still be valid until they expire. In our earlier example, we set the JWTs to have a 6 hour lifetime, so in theory a user could still access the application using a valid JWT up to 6 hours after logging out!

{{% notice warning "Invalidating JWTs" %}}

JSON Web Tokens (JWTs) are a very powerful authentication method for web APIs because they allow users to send requests without worrying about the need for a cookie session. In theory, a JWT issued by any instance of our API can be validated anywhere, making it much easier to horizontally scale this application in the future. 

In addition, requests with a JWT generally don't require a database access with each request to validate the session. Our current cookie sessions store the session data in the database, so now each incoming request containing a session cookie requires a database lookup to get information about the user before any work can be done. 

However, this means that any user with a valid JWT will be able to access our application even if they have logged out. This may present a security issue for some applications. 

There are some strategies to mitigate this risk:

1) Use JWTs with a short expiration - this means users may have to log in again and/or request new tokens more often, which could be frustrating.
2) Add a database session to each JWT - this would mean that each incoming request with a JWT would now result in a database lookup, which could slow things down. Alternatively, sessions could be stored in a faster cache mechanism such as [Redis](https://redis.io/) or [Valkey](https://valkey.io/). 
3) To permanently invalidate all existing JWT sessions (in case of a security compromise or other concern), simply change the key used to sign the JWTs to a new secure key. This is a method of last resort, but it is always important to know that it is available if needed.

{{% /notice %}}