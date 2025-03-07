---
title: "Retrieve One"
pre: "7. "
weight: 70
---

{{< youtube VihnaPGzBz8 >}}

## Retrieve One Route

Many RESTful web APIs also include the ability to retrieve a single object from a collection by providing the ID as a parameter to the route. So, let's go ahead and build that route in our application as well.

{{% notice note "Unused in Practice" %}}

While this route is an important part of many RESTful web APIs, it can often go unused since most frontend web applications will simply use the **retrieve all** endpoint to get a list of items, and then it will just cache that result and filter the list to show a user a single entry. However, there are some use cases where this route is extremely useful, so we'll go ahead and include it in our backend code anyway.

{{% /notice %}}

In our `routes/api/v1/users.js` file, we can add a new route to retrieve a single user based on the user's ID number:

```js {title="routes/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

/**
 * Gets a single user by ID
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: get single user
 *     description: Gets a single user from the application
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: user ID
 *     responses:
 *       200:
 *         description: a user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/:id", async function (req, res, next) {
  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Role,
        as: "roles",
        attributes: ["id", "role"],
        through: {
          attributes: [],
        },
      },
    });
    // if the user is not found, return an HTTP 404 not found status code
    if (user === null) {
      res.status(404).end();
    } else {
      res.json(user);
    }
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});
```

In this route, we have included a new route parameter `id` in the path for the route, and we also documented that route parameter in the Open API documentation comment. We then use that `id` parameter, which will be stored as `req.params.id` by Express, in the `findByPk` method available in [Sequelize](https://sequelize.org/docs/v6/core-concepts/model-querying-finders/). We can even confirm that our new method appears correctly in our documentation by visiting the `/docs` route in our application:

![Retrieve One Route](/images/examples/03/retrieve_1.png)

When we visit that route, we'll need to include the ID of the user to request in the path, as in `/api/v1/users/1`. If it is working correctly, we should see data for a single user returned in the browser:

![Retrieve One Route](/images/examples/03/retrieve_2.png)

## Retrieve One Unit Tests

The unit tests for the route to retrieve a single object are nearly identical to the ones use for the retrieve all route. Since we have already verified that each user exists and has the correct roles, we may not need to be as particular when developing these tests. 

```js {title="test/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

/**
 * Get single user
 */
const getSingleUser = (user) => {
  it("should get user '" + user.username + "'", (done) => {
    request(app)
      .get("/api/v1/users/" + user.id)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.shallowDeepEqual(user);
        done();
      });
  });
};

/**
 * Get single user check schema
 */
const getSingleUserSchemaMatch = (user) => {
  it("user '" + user.username + "' should match schema", (done) => {
    request(app)
      .get("/api/v1/users/" + user.id)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema(userSchema);
        done();
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  // -=-=- other code omitted here -=-=-

  describe("GET /{id}", () => {
    users.forEach((u) => {
      getSingleUser(u);
      getSingleUserSchemaMatch(u);
    })
  });
});
```

For these unit tests, we are once again simply checking that we can retrieve each individual user by ID, and also that the response matches the expected `userSchema` object we used in earlier tests.

However, these unit tests are only checking for the users that we expect the database to contain. What if we receive an ID parameter for a user that does not exist? We should also test that particular situation as well.

```js {title="test/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

/**
 * Tries to get a user using an invalid id
 */
const getSingleUserBadId = (invalidId) => {
  it("should return 404 when requesting user with id '" + invalidId + "'", (done) => {
    request(app)
      .get("/api/v1/users/" + invalidId)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  // -=-=- other code omitted here -=-=-

  describe("GET /{id}", () => {
    users.forEach((u) => {
      getSingleUser(u);
      getSingleUserSchemaMatch(u);
    })

    getSingleUserBadId(0)
    getSingleUserBadId("test")
    getSingleUserBadId(-1)
    getSingleUserBadId(5)
  });
});
```

With this unit test, we can easily check that our API properly returns HTTP status code 404 for a number of invalid ID values, including `0`, `-1`, `"test"`, `5`, and any others we can think of to try. 