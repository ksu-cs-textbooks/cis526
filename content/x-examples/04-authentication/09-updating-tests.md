---
title: "Updating Tests"
pre: "9. "
weight: 90
---

{{< youtube id >}}

## Updating Unit Tests

Of course, now that we're requiring a valid JWT for all API routes, and adding role-based authorization for most routes, all of our existing API unit tests now longer work. So, let's work on updating those tests to use our new authentication system.

First, let's build a simple helper function we can use to easily log in as a user and request a token to use in our application. We'll place this in a new file named `test/helpers.js`:

```js {title="test/helpers.js"}
/**
 * @file Unit Test Helpers
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import request from "supertest";
import app from "../app.js";

export const login = async (user) => {
  const agent = request.agent(app);
  return agent.get("/auth/bypass?token=" + user).then(() => {
    return agent
      .get("/auth/token")
      .expect(200)
      .then((res) => {
        return res.body.token;
      });
  });
};
```
This file is pretty straightforward - it simply uses the bypass login system to authenticate as a user, then it requests a token and returns it. It assumes that all other parts of the authentication process work properly - we can do this because we already have unit tests to check that functionality. 

Now, let's use this in our `test/api/v1/roles.js` file by adding a few new lines to each test. We'll start with the simple `getAllRoles` test:

```js {title="test/api/v1/roles.js" hl_lines="17-18 32 36 55 57-59 61"}
/**
 * @file /api/v1/roles Route Tests
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Load Libraries
import request from "supertest";
import { use, should } from "chai";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import chaiJsonSchemaAjv from "chai-json-schema-ajv";
import chaiShallowDeepEqual from "chai-shallow-deep-equal";

// Import Express application
import app from "../../../app.js";

// Import Helpers
import { login } from "../../helpers.js"

// Configure Chai and AJV
const ajv = new Ajv();
addFormats(ajv);
use(chaiJsonSchemaAjv.create({ ajv, verbose: true }));
use(chaiShallowDeepEqual);

// Modify Object.prototype for BDD style assertions
should();

/**
 * Get all Roles
 */
const getAllRoles = (state) => {
  it("should list all roles", (done) => {
    request(app)
      .get("/api/v1/roles")
      .set('Authorization', `Bearer ${state.token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("array");
        res.body.should.have.lengthOf(7);
        done();
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /api/v1/roles route
 */
describe("/api/v1/roles", () => {

  describe("GET /", () => {
    let state = {};

    beforeEach(async () => {
      state.token = await login("admin");
    })

    getAllRoles(state);
    
    // -=-=- other code omitted here -=-=-
  });
});
```

To update this test, we have created a new `state` object that is present in our `describe` block at the bottom of the test. That `state` object can store various things we'll use in our tests, but for now we'll just use it to store a valid JWT for our application. Then, in a `beforeEach` [Mocha hook](https://mochajs.org/#hooks), we use the `login` helper we created earlier to log in as the "admin" user and store a valid JWT for that user in the `state.token` property.

Then, we pass that `state` object to the `getAllRoles` test. Inside of that test, we use the `state.token` property to set an `Authorization: Bearer` header for our request to the API. If everything works correctly, this test should now pass.

We can make similar updates to the other tests in this file:

```js {title="test/api/v1/roles.js" hl_lines="6 24 37 41"}
// -=-=- other code omitted here -=-=-

/**
 * Check JSON Schema of Roles
 */
const getRolesSchemaMatch = (state) => {
  it("all roles should match schema", (done) => {
    const schema = {
      type: "array",
      items: {
        type: "object",
        required: ["id", "role"],
        properties: {
          id: { type: "number" },
          role: { type: "string" },
          createdAt: { type: "string", format: "iso-date-time" },
          updatedAt: { type: "string", format: "iso-date-time" },
        },
        additionalProperties: false,
      },
    };
    request(app)
      .get("/api/v1/roles")
      .set('Authorization', `Bearer ${state.token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema(schema);
        done();
      });
  });
};

/**
 * Check Role exists in list
 */
const findRole = (state, role) => {
  it("should contain '" + role.role + "' role", (done) => {
    request(app)
      .get("/api/v1/roles")
      .set('Authorization', `Bearer ${state.token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const foundRole = res.body.find((r) => r.id === role.id);
        foundRole.should.shallowDeepEqual(role);
        done();
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /api/v1/roles route
 */
describe("/api/v1/roles", () => {

  describe("GET /", () => {
    let state = {};

    beforeEach(async () => {
      state.token = await login("admin");
    })

    getAllRoles(state);
    getRolesSchemaMatch(state);
    
    roles.forEach((r) => {
      findRole(state, r);
    });
  });
});
```

This will ensure that each RESTful API action will work properly with an authenticated user, but it doesn't test whether the user has the proper role to perform the action (in this instance, we are using the `admin` user which has the appropriate role already). On the next page, we'll build a very flexible system to perform unit testing on our role-based authorization middleware. 