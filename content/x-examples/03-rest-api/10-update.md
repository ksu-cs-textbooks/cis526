---
title: "Update"
pre: "9. "
weight: 90
---

{{< youtube id >}}

## Update Route

Next, let's look at adding an additional route in our application that allows us to update a `User` model. This route is very similar to the route used to create a user, but there are a few key differences as well.

```js {title="routes/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

/**
 * Update a user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: update user
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: user ID
 *     requestBody:
 *       description: user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             username: updateduser
 *             roles:
 *               - id: 6
 *               - id: 7
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.put("/:id", async function (req, res, next) {
  try {
    const user = await User.findByPk(req.params.id)

    // if the user is not found, return an HTTP 404 not found status code
    if (user === null) {
      res.status(404).end();
    } else {
      await database.transaction(async (t) => {
        await user.update(
          // Update the user object using body attributes
          {
            username: req.body.username,
          },
          // Assign to a database transaction
          {
            transaction: t,
          },
        );
  
        // If roles are included in the body
        if (req.body.roles) {
          // Find all roles listed
          const roles = await Promise.all(
            req.body.roles.map(({ id, ...next }) => {
              return Role.findByPk(id);
            }),
          );
  
          // Attach roles to user
          await user.setRoles(roles, { transaction: t });
        } else {
          // Remove all roles
          await user.setRoles([], { transaction: t });
        }
  
        // Send the success message
        sendSuccess("User saved!", 201, res);
      });
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      handleValidationError(error, res);
    } else {
      logger.error(error);
      res.status(500).end();
    }
  }
});

// -=-=- other code omitted here -=-=-
```

As we can see, overall this route is very similar to the create route. The only major difference is that we must first find the user we want to update based on the query parameter, and then we use the `update` database method to update the existing values in the database. The rest of the work updating the related `Roles` models is exactly the same. We can also reuse the utility functions we created for the previous route. 

Just like we did earlier, we can test this route using the Open API documentation website to confirm that it is working correctly before we even move on to testing it.

## Unit Testing Update Route

The unit tests for the route to update a user are very similar to the ones used for creating a user. First, we need a test that will confirm we can successfully update a user entry:

```js {title="test/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

/**
 * Update a user successfully
 */
const updateUser = (id, user) => {
  it("should successfully update user ID '" + id + "' to '" + user.username + "'", (done) => {
    request(app)
      .put("/api/v1/users/" + id)
      .send(user)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("message");
        // Find user in list of all users
        request(app)
          .get("/api/v1/users")
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            const foundUser = res.body.find(
              (u) => u.id === id,
            );
            foundUser.should.shallowDeepEqual(user);
            done();
          });
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  // -=-=- other code omitted here -=-=-

  describe("PUT /{id}", () => {
    updateUser(3, new_user);
  });
});
```

Next, we also want to check that any updated users have the correct roles attached, including instances where the roles were completely removed:

```js {title="test/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

/**
 * Update a user and roles successfully
 */
const updateUserAndRoles = (id, user) => {
  it("should successfully update user ID '" + id + "' roles", (done) => {
    request(app)
      .put("/api/v1/users/" + id)
      .send(user)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("message");
        // Find user in list of all users
        request(app)
          .get("/api/v1/users")
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            const foundUser = res.body.find(
              (u) => u.id === id,
            );
            // Handle case where user has no roles assigned
            const roles = user.roles || []
            foundUser.roles.should.be.an("array");
            foundUser.roles.should.have.lengthOf(roles.length);
            roles.forEach((role) => {
              expect(foundUser.roles.some((r) => r.id === role.id)).to.equal(true);
            })
            done();
          });
      });
  });
};


// -=-=- other code omitted here -=-=-

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  // -=-=- other code omitted here -=-=-

  describe("PUT /{id}", () => {
    updateUser(3, new_user);
    updateUserAndRoles(3, new_user);
    updateUserAndRoles(2, new_user_no_roles);
  });
});
```

We also should check that the username is unchanged if an update is sent with no username attribute, but the rest of the update will succeed. For this test, we can just create a new mock object with just roles and no username included.

```js {title="test/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

// Update user structure with only roles
const update_user_only_roles = {
  roles: [
    {
      id: 6,
    },
    {
      id: 7,
    },
  ],
};

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  // -=-=- other code omitted here -=-=-

  describe("PUT /{id}", () => {
    updateUser(3, new_user);
    updateUserAndRoles(3, new_user);
    updateUserAndRoles(2, new_user_no_roles);
    updateUserAndRoles(1, update_user_only_roles);
  });
});
```

Finally, we should include a couple of tests to handle the situation where a duplicate username is provided, or where an invalid role is provided. These are nearly identical to the tests used in the create route earlier in this example:

```js {title="test/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

/**
 * Fails to update user with a duplicate username
 */
const updateUserFailsOnDuplicateUsername = (id, user) => {
  it("should fail on duplicate username '" + user.username + "'", (done) => {
    request(app)
      .put("/api/v1/users/" + id)
      .send(user)
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("error");
        res.body.should.have.property("errors");
        res.body.errors.should.be.an("array");
        // the error should be related to the username attribute
        expect(
          res.body.errors.some((e) => e.attribute === "username"),
        ).to.equal(true);
        done();
      });
  });
};

/**
 * Fails to update user with bad role ID
 */
const updateUserFailsOnInvalidRole = (id, user, role_id) => {
  it("should fail when invalid role id '" + role_id + "' is used", (done) => {
    // Create a copy of the user object
    const updated_user = { ...user };
    // Make a shallow copy of the roles array
    updated_user.roles = [... user.roles]
    // Add invalid role ID to user object
    updated_user.roles.push({
      id: role_id,
    });
    request(app)
      .put("/api/v1/users/" + id)
      .send(updated_user)
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("error");
        // User with invalid roles should not be updated
        request(app)
          .get("/api/v1/users")
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.some((u) => u.username === updated_user.username)).to.equal(
              false,
            );
            done();
          });
      });
  });
};

// -=-=- other code omitted here -=-=-

// Update user structure with duplicate username
const update_user_duplicate_username = {
  username: "admin",
};

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  // -=-=- other code omitted here -=-=-

  describe("PUT /{id}", () => {
    updateUser(3, new_user);
    updateUserAndRoles(3, new_user);
    updateUserAndRoles(2, new_user_no_roles);
    updateUserAndRoles(1, update_user_only_roles);

    updateUserFailsOnDuplicateUsername(2, update_user_duplicate_username);
    updateUserFailsOnInvalidRole(4, new_user, 0);
    updateUserFailsOnInvalidRole(4, new_user, -1);
    updateUserFailsOnInvalidRole(4, new_user, 8);
    updateUserFailsOnInvalidRole(4, new_user, "test");
  })
});
```

There we go! We have a set of unit tests that cover most of the situations we can anticipate seeing with our route to update users. If we run all of these tests at this point, they should all pass:

``` {title="output"}
    PUT /{id}
      ✔ should successfully update user ID '3' to 'test_user'
      ✔ should successfully update user ID '3' roles
      ✔ should successfully update user ID '2' roles
      ✔ should successfully update user ID '1' roles
      ✔ should fail on duplicate username 'admin'
      ✔ should fail when invalid role id '0' is used
      ✔ should fail when invalid role id '-1' is used
      ✔ should fail when invalid role id '8' is used
      ✔ should fail when invalid role id 'test' is used
```

Great! Now is a great time to **lint, format, and then commit and push** our work to GitHub before continuing.