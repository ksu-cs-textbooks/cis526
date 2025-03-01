---
title: "Delete"
pre: "10. "
weight: 100
---

{{< youtube id >}}

## Delete Route

Finally, the last route we need to add to our `users` routes is the delete route. This route is very simple - it will remove a user based on the given user ID if it exists in the database:

```js {title="routes/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

/**
 * Delete a user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: delete user
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
 *         $ref: '#/components/responses/Success'
 */
router.delete("/:id", async function (req, res, next) {
  try {
    const user = await User.findByPk(req.params.id)

    // if the user is not found, return an HTTP 404 not found status code
    if (user === null) {
      res.status(404).end();
    } else {
      await user.destroy();

      // Send the success message
      sendSuccess("User deleted!", req.params.id, 200, res);
    }
  } catch (error) {
    console.log(error)
    logger.error(error);
    res.status(500).end();
  }
});

// -=-=- other code omitted here -=-=-
```

Once again, we can test this route using the Open API documentation website. Let's look at how we can quickly unit test it as well.

## Unit Testing Delete Route

The unit tests for this route are similarly very simple. We really only have two cases - the user is found and successfully deleted, or the user cannot be found and an HTTP 404 response is returned.

```js {title="test/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

/**
 * Delete a user successfully
 */
const deleteUser = (id) => {
  it("should successfully delete user ID '" + id, (done) => {
    request(app)
      .delete("/api/v1/users/" + id)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("message");
        // Ensure user is not found in list of users
        request(app)
          .get("/api/v1/users")
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.some((u) => u.id === id)).to.equal(false);
            done();
          });
      });
  });
};

/**
 * Fail to delete a missing user
 */
const deleteUserFailsInvalidId= (id) => {
  it("should fail to delete invalid user ID '" + id, (done) => {
    request(app)
      .delete("/api/v1/users/" + id)
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

    describe("DELETE /{id}", () => {
    deleteUser(4);
    deleteUserFailsInvalidId(0)
    deleteUserFailsInvalidId(-1)
    deleteUserFailsInvalidId(5)
    deleteUserFailsInvalidId("test")
  });
});
```

There we go! That will cover all of the unit tests for the `users` route. If we try to run all of our tests, we should see that they succeed!

``` {title="output"}
DELETE /{id}
      ✔ should successfully delete user ID '4
      ✔ should fail to delete invalid user ID '0
      ✔ should fail to delete invalid user ID '-1
      ✔ should fail to delete invalid user ID '5
      ✔ should fail to delete invalid user ID 'test
```

All told, we write just 5 API routes (retrieve all, retrieve one, create, update, and delete) but wrote 53 different unit tests to fully test those routes. 

Now is a great time to **lint, format, and then commit and push** our work to GitHub.

In the next example, we'll explore how to add authentication to our RESTful API.