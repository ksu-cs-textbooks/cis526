---
title: "Retrieve All"
pre: "6. "
weight: 60
---

{{< youtube id >}}

## Users Routes

Now that we have written and tested the routes for the `Role` model, let's start working on the routes for the `User` model. These routes will be much more complex, because we want the ability to add, update, and delete users in our database. 

To do this, we'll create several RESTful routes, which pair HTTP verbs and paths to the various CRUD operations that can be performed on the database. Here is a general list of the actions we want to perform on most models in a RESTful API, based on their associated CRUD operation:

* Create New (HTTP POST)
* Retrieve All / Retrieve One (HTTP GET)
* Update One (HTTP PUT)
* Delete One (HTTP DELETE)

As we build this new API router, we'll see each one of these in action.

## Retrieve All Route

The first operation we'll look at is the **retrieve all** operation, which is one we're already very familiar with. To begin, we should start by copying the existing file at `routes/users.js` to `routes/api/v1/users.js` and modifying it a bit to contain this content:

```js {title="routes/api/v1/users.js" hl_lines="24-25 35 51 63-66" }
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

// Create Express router
const router = express.Router();

// Import models
import {
  User,
  Role,
} from "../../../models/models.js";

// Import logger
import logger from "../../../configs/logger.js";

/**
 * Gets the list of users
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: users list page
 *     description: Gets the list of all users in the application
 *     tags: [users]
 *     responses:
 *       200:
 *         description: the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll({
      include: {
        model: Role,
        as: "roles",
        attributes: ["id", "role"],
        through: {
          attributes: [],
        },
      },
    });
    res.json(users);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

export default router;
```

This is very similar to the code we included in our `roles` route. The major difference is that the `users` route will also output the list of roles assigned to the user. There is a lot of great information in the [Sequelize Documentation](https://sequelize.org/docs/v6/core-concepts/assocs/#basics-of-queries-involving-associations) for how to properly query associated records. 

We'll also need to remove the line from our `app.js` file that directly imports and uses that router:

```js {title="app.js" hl_lines="5 12"}
// -=-=- other code omitted here -=-=-

// Import routers
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js"; // delete this line
import apiRouter from "./routes/api.js";

// -=-=- other code omitted here -=-=-

// Use routers
app.use("/", indexRouter);
app.use("/users", usersRouter); // delete this line
app.use("/api", apiRouter);

// -=-=- other code omitted here -=-=-
```

Instead, we can now import and link the new router in our `routes/api.js` file:

```js {title="routes/api.js" hl_lines="5 12"}
// -=-=- other code omitted here -=-=-

// Import v1 routers
import rolesRouter from "./api/v1/roles.js";
import usersRouter from "./api/v1/users.js";

// Create Express router
const router = express.Router();

// Use v1 routers
router.use("/v1/roles", rolesRouter);
router.use("/v1/users", usersRouter);

// -=-=- other code omitted here -=-=-
```

Before moving on, let's run our application and make sure that the `users` route is working correctly:

```bash {title="terminal"}
$ npm run dev
```

Once it loads, we can navigate to the `/api/v1/users` URL to see the output:

![Retrieve All Ouptut](/images/examples/03/retrieveall_1.png)

## Retrieve All Unit Tests

As we write each of these routes, we'll also explore the related unit tests. The first three unit tests for this route are very similar to the ones we wrote for the `roles` routes earlier, so we won't go into too much detail on these. As expected, we'll place all of the unit tests for the `users` routes in the `test/api/v1/users.js` file:

```js {title="test/api/v1/users.js" hl_lines="35-45"}
/**
 * @file /api/v1/users Route Tests
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

// Configure Chai and AJV
const ajv = new Ajv();
addFormats(ajv);
use(chaiJsonSchemaAjv.create({ ajv, verbose: true }));
use(chaiShallowDeepEqual);

// Modify Object.prototype for BDD style assertions
should();

// User Schema
const userSchema = {
  type: "object",
  required: ["id", "username"],
  properties: {
    id: { type: "number" },
    username: { type: "string" },
    createdAt: { type: "string", format: "iso-date-time" },
    updatedAt: { type: "string", format: "iso-date-time" },
    roles: {
      type: "array",
      items: {
          type: 'object',
          required: ['id', 'role'],
          properties: {
              id: { type: 'number' },
              role: { type: 'string' },
          },
      },
    }
  },
  additionalProperties: false,
};

/**
 * Get all Users
 */
const getAllUsers = () => {
  it("should list all users", (done) => {
    request(app)
      .get("/api/v1/users")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("array");
        res.body.should.have.lengthOf(4);
        done();
      });
  });
};

/**
 * Check JSON Schema of Users
 */
const getUsersSchemaMatch = () => {
  it("all users should match schema", (done) => {
    const schema = {
      type: "array",
      items: userSchema
    };
    request(app)
      .get("/api/v1/users")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema(schema);
        done();
      });
  });
};

/**
 * Check User exists in list
 */
const findUser = (user) => {
  it("should contain '" + user.username + "' user", (done) => {
    request(app)
      .get("/api/v1/users")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const foundUser = res.body.find((u) => u.id === user.id);
        foundUser.should.shallowDeepEqual(user);
        done();
      });
  });
};

// List of all expected users in the application
const users = [
  {
    id: 1,
    username: "admin",
  },
  {
    id: 2,
    username: "contributor",
  },
  {
    id: 3,
    username: "manager",
  },
  {
    id: 4,
    username: "user",
  }
];

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  describe("GET /", () => {
    getAllUsers();
    getUsersSchemaMatch();
    
    users.forEach((u) => {
      findUser(u);
    });
  });
});

```

The major difference to note is in the highlighted section, where we have to add some additional schema information to account for the `roles` associated attribute that is part of the `users` object. It is pretty self-explanatory; each object in the array has a set of attributes that match what we used in the unit test for the `roles` routes.

We also moved the schema for the `User` response object out of that unit test so we can reuse it in other unit tests, as we'll see later in this example.

However, we also should add a couple of additional unit tests to confirm that each user has the correct roles assigned, since that is a major part of the security and authorization mechanism we'll be building for this application. While we could do that as part of the `findUser` test, let's go ahead and add separate tests for each of these, which is helpful in debugging anything that is broken or misconfigured.

```js {title="test/api/v1/users.js" hl_lines="8"}
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

// -=-=- other code omitted here -=-=-

/**
 * Check that User has correct number of roles
 */
const findUserCountRoles = (username, count) => {
  it("user '" + username + "' should have " + count + " roles", (done) => {
    request(app)
      .get("/api/v1/users")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const foundUser = res.body.find((u) => u.username === username);
        foundUser.roles.should.be.an("array");
        foundUser.roles.should.have.lengthOf(count);
        done();
      });
  });
};

/**
 * Check that User has specific role
 */
const findUserConfirmRole = (username, role) => {
  it("user '" + username + "' should have '" + role + "' role", (done) => {
    request(app)
      .get("/api/v1/users")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const foundUser = res.body.find((u) => u.username === username);
        expect(foundUser.roles.some((r) => r.role === role)).to.equal(true)
        done();
      });
  });
};

// -=-=- other code omitted here -=-=-

// List of all users and expected roles
const user_roles = [
  {
    username: "admin",
    roles: ["manage_users", "manage_documents", "manage_communities"]
  },
  {
    username: "contributor",
    roles: ["add_documents", "add_communities"]
  },
  {
    username: "manager",
    roles: ["manage_documents", "manage_communities"]
  },
  {
    username: "user",
    roles: ["view_documents", "view_communities"]
  },
];

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  describe("GET /", () => {

    // -=-=- other code omitted here -=-=-
    
    user_roles.forEach((u) => {
      // Check that user has correct number of roles
      findUserCountRoles(u.username, u.roles.length)
      u.roles.forEach((r) => {
        // Check that user has each expected role
        findUserConfirmRole(u.username, r)
      })
    });
  });
});
```

This code uses an additional assertion, `expect`, from the `chai` library, so we have to import it at the top on the highlighted line. These two tests will confirm that the user has the expected number of roles, and also explicitly confirm that each user has each of the expected roles. 

{{% notice tip "Testing Arrays for Containment" %}}

When writing unit tests that deal with arrays, it is always important to not only check that the array contains the correct elements, but also that it **ONLY** contains those elements and no additional elements. A great way to do this is to explicitly check each element the array should contain is present, and then **also** check the size of the array so that it can only contain those listed elements. Of course, this assumes that each element is only present once in the array!

If we aren't careful about how these unit tests are constructed, it is possible for arrays to contain additional items. In this case, it might mean that a user is assigned to more roles than they should be, which would be very bad for our application's security!

{{% /notice %}}

With all of these tests in place, let's go ahead and run them to confirm everything is working properly. Thankfully, with the `mocha` test runner, we can even specify a single file to run, as shown below:

```bash {title="terminal"}
$ npm run test test/api/v1/users.js
```

If everything is correct, we should see that this file has 19 tests that pass:

``` {title="output"}
  /api/v1/users
    GET /
      ✔ should list all users
      ✔ all users should match schema
      ✔ should contain 'admin' user
      ✔ should contain 'contributor' user
      ✔ should contain 'manager' user
      ✔ should contain 'user' user
      ✔ user 'admin' should have 3 roles
      ✔ user 'admin' should have 'manage_users' role
      ✔ user 'admin' should have 'manage_documents' role
      ✔ user 'admin' should have 'manage_communities' role
      ✔ user 'contributor' should have 2 roles
      ✔ user 'contributor' should have 'add_documents' role
      ✔ user 'contributor' should have 'add_communities' role
      ✔ user 'manager' should have 2 roles
      ✔ user 'manager' should have 'manage_documents' role
      ✔ user 'manager' should have 'manage_communities' role
      ✔ user 'user' should have 2 roles
      ✔ user 'user' should have 'view_documents' role
      ✔ user 'user' should have 'view_communities' role


  19 passing (1s)
```

Great! Now is a great time to **lint, format, and then commit and push** our work to GitHub before continuing.