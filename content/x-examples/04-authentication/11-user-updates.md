---
title: "Users API Updates"
pre: "11. "
weight: 110
---

{{< youtube id >}}

## Users API Roles

We should also add our role-based authorization middleware to our `/api/v1/users` routes. This can actually be done really simply, because we only want users with the `manage_users` role to be able to access any of these routes.

So, instead of attaching the middleware to each handler individually, we can attach it directly to the router before any handlers:

```js {title="routes/api/v1/users.js" hl_lines="28-29 35-36"}
/**
 * @file Users router
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: users
 *   description: Users Routes
 */

// Import libraries
import express from "express";
import { ValidationError } from "sequelize";

// Create Express router
const router = express.Router();

// Import models
import { User, Role } from "../../../models/models.js";

// Import logger
import logger from "../../../configs/logger.js";

// Import database
import database from "../../../configs/database.js";

// Import middlewares
import roleBasedAuth from "../../../middlewares/authorized-roles.js";

// Import utilities
import handleValidationError from "../../../utilities/handle-validation-error.js";
import sendSuccess from "../../../utilities/send-success.js";

// Add Role Authorization to all routes
router.use(roleBasedAuth("manage_users"));

// -=-=- other code omitted here -=-=-
```

That's all it takes to add role-based authorization to an entire router! It is really simple. 

We also should remember to add the new `security` section to our Open API documentation comments for each route to ensure that our documentation properly displays that each route requires authentication. 

## Users API Unit Tests - Authentication

As part of our updates, we need to add authentication to each of our unit tests for the `/api/v1/users` routes. This is relatively straightforward based on what we did in the previous page - it just requires a few tweaks per test. 

In short, we need to add a `state` variable that we can use that contains a token for a user, and then pass that along to each test. We can do this in the global `describe` section at the bottom:

```js {title="test/api/v1/users.js" hl_lines="17-18 26 28-30"}
/**
 * @file /api/v1/users Route Tests
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Load Libraries
import request from "supertest";
import { use, should, expect } from "chai";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import chaiJsonSchemaAjv from "chai-json-schema-ajv";
import chaiShallowDeepEqual from "chai-shallow-deep-equal";

// Import Express application
import app from "../../../app.js";

// Import Helpers
import { login, testRoleBasedAuth, all_roles } from "../../helpers.js";

// -=-=- other code omitted here -=-=-

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  let state = {};

  beforeEach(async () => {
    state.token = await login("admin");
  });

  // -=-=- other code omitted here -=-=-
});
```

Notice that we are able to add that code outside of the `describe` sections for each API endpoint, greatly simplifying things. Of course, if we need to log in as multiple users, we can either add additional tokens to the `state` or move the `state` and `beforeEach` methods to other locations in the code.

Once we have our state, we can simply pass it on to the tests and update each test to use it correctly by setting an `Authorization: Bearer` header on each request:

```js {title="test/api/v1/users.js" hl_lines="6 10 34"}
// -=-=- other code omitted here -=-=-

/**
 * Get all Users
 */
const getAllUsers = (state) => {
  it("should list all users", (done) => {
    request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${state.token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("array");
        res.body.should.have.lengthOf(4);
        done();
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  let state = {};

  beforeEach(async () => {
    state.token = await login("admin");
  });

  describe("GET /", () => {
    getAllUsers(state);

    // -=-=- other code omitted here -=-=-
  });

  // -=-=- other code omitted here -=-=-
});
```

We won't exhaustively show each update to these tests here since there are so many. Take the time now to update all of the `/api/v1/users` unit tests to include authentication before continuing. They should all pass once authentication is enabled. 

## Users API Unit Tests - Role-Based Authorization

Finally, we should add additional unit tests to ensure that each endpoint in the `/api/v1/users` router is accessible only by users with the correct role. For that, we can simply add a block of code similar to what we did in the `roles` routes for each endpoint:

```js {title="test/api/v1/users.js" hl_lines="16-19 25-28 34-37 43-46 52-55"}
// -=-=- other code omitted here -=-=-

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  let state = {};

  beforeEach(async () => {
    state.token = await login("admin");
  });

  describe("GET /", () => {
    // -=-=- other code omitted here -=-=-

    const allowed_roles = ["manage_users"];
    all_roles.forEach((r) => {
      testRoleBasedAuth("/api/v1/users", "get", r, allowed_roles.includes(r))
    })
  });

  describe("GET /{id}", () => {
    // -=-=- other code omitted here -=-=-

    const allowed_roles = ["manage_users"];
    all_roles.forEach((r) => {
      testRoleBasedAuth("/api/v1/users/1", "get", r, allowed_roles.includes(r))
    })
  });

  describe("POST /", () => {
    // -=-=- other code omitted here -=-=-

    const allowed_roles = ["manage_users"];
    all_roles.forEach((r) => {
      testRoleBasedAuth("/api/v1/users", "post", r, allowed_roles.includes(r))
    })
  });

  describe("PUT /{id}", () => {
    // -=-=- other code omitted here -=-=-

    const allowed_roles = ["manage_users"];
    all_roles.forEach((r) => {
      testRoleBasedAuth("/api/v1/users/1", "put", r, allowed_roles.includes(r))
    })
  });

  describe("DELETE /{id}", () => {
    // -=-=- other code omitted here -=-=-

    const allowed_roles = ["manage_users"];
    all_roles.forEach((r) => {
      testRoleBasedAuth("/api/v1/users/1", "delete", r, allowed_roles.includes(r))
    })
  });
});
```

All told, there should now be 88 total unit test in that file alone - that is a lot of tests for just 5 API endpoints!

Now is a great time to **lint, format, and then commit and push** our work to GitHub.

That concludes the first set of tutorials for building a RESTful API. In the next set of tutorials, we'll focus on building a Vue.js frontend for our application. 