---
title: "Testing Roles"
pre: "10. "
weight: 100
---

{{< youtube lolT-mwmFvc >}}

## Testing Role-Based Authorization Middleware

Earlier in this example we created a generator function named `roleBasedAuth` (stored in `middlewares/authorized-roles.js`) that returns a middleware function named `roleAuthMiddleware` that we can use as a middleware in any of our RESTful API endpoints to ensure that only users with specific roles are able to perform each and every action in our API.

When it comes to testing, however, this can quickly become really complex. For example, if we have 15 routes and 6 user roles, we must write 120 tests just to test each combination of route and role in order to truly test this setup.

In addition, if we continue to use our current strategy of integration testing (where each test performs a full action on the API), the tests we write will need to be unique for each endpoint, so even if we simplify things, we'll still need at least 2 tests per endpoint (one for roles that should have access, and another for roles that should not).

Instead, let's look at a way we can deconstruct our Express application a bit to test two things directly:
1) Is the `roleAuthMiddleware` present on each route?
2) Does the `roleAuthMiddleware` function allow the correct roles for each route?

If we can confirm both of these for each route, we can assume that our role-based authorization is implemented correctly.

## Express Route Stack

As you may recall, applications written in Express consist of an application that has middlewares and handlers attached in a specific order. In addition, we can create smaller components called routers that each have their own middlewares and handlers attached. Overall, we may end up with a structure similar to this one:

![Express Architecture](/images/examples/04/express-routing-http.svg)[^1]

[^1]: Image Source: https://www.sohamkamani.com/nodejs/expressjs-architecture/

A more detailed explanation of the structure of Express applications can be found here: https://www.sohamkamani.com/nodejs/expressjs-architecture/

In code, each Express router has a `stack` variable that contains a list of layers, which can either be middleware functions or actual route handlers. Middleware layers will contain the `name` of the middleware function, whereas route handlers can be checked using a `match` function to determine if the handler matches a given path. 

So, in our `test/helpers.js` file, we can write a new helper function to this for our tests:

```js {title="test/helpers.js"}
// -=-=- other code omitted here -=-=-

/**
 * Iterate through the router stack of an Express app to find a matching middleware function
 * attached to a particular path and/or method
 *
 * @param {string} name the name of the function to find
 * @param {string} path the path of the endpoint
 * @param {string} method the HTTP method of the endpoint
 * @param {Router} router The Express router to search
 * @returns
 */
const findMiddlewareFunction = (name, path, method, router = app._router) => {
  for (const layer of router.stack) {
    // Return if the middleware function is found
    if (layer.name === name) {
      return layer.handle;
    } else {
      if (layer.match(path)) {
        // Recurse into a router
        if (layer.name === "router" && layer.path.length > 0) {
          // Remove matching portion of path
          path = path.slice(layer.path.length);
          return findMiddlewareFunction(name, path, method, layer.handle);
        }
        // Find matching handler
        if (layer.route && layer.route.methods[method]) {
          return findMiddlewareFunction(name, path, method, layer.route);
        }
      }
    }
  }
  return null;
};

// -=-=- other code omitted here -=-=-
```

{{% notice note "Express 5.0 Updates" %}}

Starting with Express version 5.0, `app._router` has been moved to `app.router` to make accessing the built-in router easier. This should be updated in the code above if you are running Express 5.0 or later. [Changelog](https://expressjs.com/en/guide/migrating-5.html#app.router)

{{% /notice %}}

Using that function, we can now write another function to actually test our middleware using some mock objects:

```js {title="test/helpers.js" hl_lines="5-6"}
// -=-=- other code omitted here -=-=-

// Import Libraries
import request from "supertest";
import { expect } from "chai";
import sinon from "sinon";

// -=-=- other code omitted here -=-=-

/**
 * Test if a role is able to access the route via the roleAuthMiddleware function
 *
 * @param {string} path the path of the endpoint
 * @param {string} method the HTTP method of the endpoint
 * @param {string} role the role to search for
 * @param {boolean} allowed whether the role should be allowed to access the route
 */
export const testRoleBasedAuth = (path, method, role, allowed) => {
  it(
    "should role '" + role + "' access '" + method + " " + path + "': " + allowed,
    (done) => {
      // Mock Express Request object with token attached
      const req = {
        token: {
          username: "test",
          roles: [
            {
              role: role,
            },
          ],
        },
      };

      // Mock Express Response object
      const res = {
        status: sinon.stub(),
        send: sinon.stub(),
      };
      res.status.returns(res);

      // Mock Express Next Middleware function
      const next = sinon.stub();

      // Find the middleware function in the router stack for the given path and method
      const middleware = findMiddlewareFunction(
        "roleAuthMiddleware",
        path,
        method,
      );
      expect(middleware).to.not.equal(null);

      // Call the middleware function
      middleware(req, res, next);

      if (allowed) {
        // If allowed, expect the `next` function to be called
        expect(next.calledOnce).to.equal(true);
      } else {
        // Otherwise, it should send a 401 response
        expect(res.status.calledWith(401)).to.equal(true);
      }
      done();
    },
  );
};
```

The comments in the function describe how it works pretty clearly. Most of the code is just setting up barebones mock objects using [Sinon](https://sinonjs.org/) for the Express request `req`, response `res`, and `next` middleware function. Once it finds our `roleAuthMiddleware` function in the router stack using the helper function above, it will call it and observe the response to determine if the user was allowed to access the desired endpoint or not.

The last thing we'll add to our `test/helpers.js` file is a helpful list of all of the roles available in the application, which we can use for our testing:

```js {title="test/helpers.js"}
// -=-=- other code omitted here -=-=-

// List of global roles
export const all_roles = [
  "manage_users",
  "manage_documents",
  "add_documents",
  "manage_communities",
  "add_communities",
  "view_documents",
  "view_communities",
];
```

With those helpers in place, we can now add a few lines to our `test/api/v1/roles.js` test file to check whether each and every role can access the endpoint in that router.

```js {title="test/api/v1/roles.js" hl_lines="4 15-18"}
// -=-=- other code omitted here -=-=-

// Import Helpers
import { login, testRoleBasedAuth, all_roles } from "../../helpers.js";

// -=-=- other code omitted here -=-=-

/**
 * Test /api/v1/roles route
 */
describe("/api/v1/roles", () => {
  describe("GET /", () => {
    // -=-=- other code omitted here -=-=-

    const allowed_roles = ["manage_users"];
    all_roles.forEach((r) => {
      testRoleBasedAuth("/api/v1/roles", "get", r, allowed_roles.includes(r))
    })
  });
});
```

This code does a couple of very nifty things. First, we clearly define which roles should be allowed to access the endpoint. This can be done as part of the unit testing file here, or we may have some global file in our test suite that documents each role and route that we can read from. 

Below that, we iterate through the list of all roles exported from the `test/helpers.js` file, and call our `testRoleBasedAuth` method for each one of those roles. The last argument to that function is a boolean that determines whether the role should be able to access this route. To determine that, we simply see if the role from the list of global roles can also be found in the list of allowed roles. If so, that will be `true` and the function will check that the role can access the route. If not, it will be `false` and the function will confirm that the user is unable to access the route.

Now, when we run these tests, we'll see that each role is explicitly checked:

``` {title="output"}
  /api/v1/roles
    GET /
      ✔ should list all roles
      ✔ all roles should match schema
      ✔ should contain 'manage_users' role
      ✔ should contain 'manage_documents' role
      ✔ should contain 'add_documents' role
      ✔ should contain 'manage_communities' role
      ✔ should contain 'add_communities' role
      ✔ should contain 'view_documents' role
      ✔ should contain 'view_communities' role
      ✔ should role 'manage_users' access 'get /api/v1/roles': true
      ✔ should role 'manage_documents' access 'get /api/v1/roles': false
      ✔ should role 'add_documents' access 'get /api/v1/roles': false
      ✔ should role 'manage_communities' access 'get /api/v1/roles': false
      ✔ should role 'add_communities' access 'get /api/v1/roles': false
      ✔ should role 'view_documents' access 'get /api/v1/roles': false
      ✔ should role 'view_communities' access 'get /api/v1/roles': false
```

There we go! We now have a very flexible way to test our role-based authorization. 
