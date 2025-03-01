---
title: "Testing Create"
pre: "9. "
weight: 90
---

{{< youtube id >}}

## Manual Testing with Open API

Before we start unit testing this route, let's quickly do some manual testing using the Open API documentation site. It is truly a very handy way to work with our RESTful APIs as we are developing them, allowing us to test them quickly in isolation to make sure everything is working properly.

So, let's start our server:

```bash {title="terminal"}
$ npm run dev
```

Once it starts, we can navigate to the `/docs` URL, and we should see the Open API documentation for our site, including a new `POST` route for the `users` section:

![Create API Documentation](/images/examples/03/create_1.png)

If we documented our route correctly, we can see that this documentation includes not only an example for what a new submission should look like, but also examples of the **success** and **model validation error** outputs should be. To test it, we can use the **Try it out** button on the page to try to create a new user.

![Create Example](/images/examples/03/create_2.png)

Let's go ahead and try to create the user that is suggested by our example input, which should look like this:

```json {title="input"}
{
  "username": "newuser",
  "roles": [
    {
      "id": 6
    },
    {
      "id": 7
    }
  ]
}
```

This would create a user with the username `newuser` and assign them to the roles with IDs 6 (`view_documents`) and 7 (`view_communities`). So, we can click the **Execute** button to send that request to the server and see if it works.

![Create Success](/images/examples/03/create_3.png)

Excellent! We can see that it worked correctly, and we received our expected success message as part of the response. We can also scroll up and try the `GET /api/v1/users` API endpoint to see if that user appears in our list of all users in the system with the correct roles assigned. If we do, we should see this in the output:

```json {title="output"}
  {
    "id": 6,
    "username": "newuser",
    "createdAt": "2025-02-21T18:34:54.725Z",
    "updatedAt": "2025-02-21T18:34:54.725Z",
    "roles": [
      {
        "id": 6,
        "role": "view_documents"
      },
      {
        "id": 7,
        "role": "view_communities"
      }
    ]
  }
```

From here, we can try a couple of different scenarios to see if our server is working properly.

### Duplicate Username

First, what if we try and create a user with a duplicate username? To test this, we can simply resubmit the default example again and see what happens. This time, we get an HTTP 422 response code with a very detailed error message:

![Create Failure - Duplicate Username](/images/examples/03/create_4.png)

This is great! It tells us exactly what the error is. This is the output created by our `handleValidationError` utility function from the previous page.

### Missing Attributes

We can also try to submit a new user, but this time we can accidentally leave out some of the attributes, as in this example:

```json {title="input"}
{
  "user": "testuser"
}
```

Here, we have mistakenly renamed the `username` attribute to just `user`, and we've left off the `roles` list entirely. When we submit this, we also get a helpful error message:

![Create Failure - Username Null](/images/examples/03/create_5.png)

Since the `username` attribute was not provided, it will be set to `null` and the database will not allow a `null` value for that attribute.

However, if we correct that, we do see that it will accept a new user without any listed roles! This is by design, since we may need to create users that don't have any roles assigned.

### Invalid Roles

Finally, what if we try to create a user with an invalid list of roles:

```json {title="input"}
{
  "username": "baduser",
  "roles": [
    {
      "id": 6
    },
    {
      "id": 8
    }
  ]
}
```

In this instance, we'll get another helpful error message:

![Create Failure - Role Null](/images/examples/03/create_6.png)

Since there is no role with ID 8 in the database, it finds a `null` value instead and tries to associate that with our user. This causes an SQL constraint error, which we can send back to our user.

Finally, we should also double-check that our user `baduser` was not created using `GET /api/v1/users` API endpoint above. This is because we don't want to create that user unless a list of valid roles are also provided.

## Unit Testing

Now that we have a good handle on how this endpoint works in practice, let's write some unit tests to confirm that it works as expected in each of these cases. First, we should have a simple unit test that successfully creates a new user:

```js {title="test/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

/**
 * Creates a user successfully
 */
const createUser = (user) => {
  it("should successfully create a user '" + user.username + "'", (done) => {
    request(app)
      .post("/api/v1/users/")
      .send(user)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("message");
        res.body.should.have.property("id")
        const created_id = res.body.id
        // Find user in list of all users
        request(app)
          .get("/api/v1/users")
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            const foundUser = res.body.find(
              (u) => u.id === created_id,
            );
            foundUser.should.shallowDeepEqual(user);
            done();
          });
      });
  });
};

// -=-=- other code omitted here -=-=-

// New user structure for creating users
const new_user = {
  username: "test_user",
  roles: [
    {
      id: 6
    },
    {
      id: 7
    }
  ]
}

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  // -=-=- other code omitted here -=-=-

  describe("POST /", () => {
    createUser(new_user);
  })
});
```

This first test is very straightforward since it just confirms that we can successfully create a new user in the system. It also confirms that the user now appears in the output from the **get all** route, which is helpful.

While this at least confirms that the route works as expected, we should write several more unit tests to confirm that the route works correctly even if the user provides invalid input.

### Missing Attributes

First, we should confirm that the user will be created even with the list of roles missing. We can do this just by creating a second `new_user` object that is missing the list of roles.

```js {title="test/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

// New user structure for creating users without roles
const new_user_no_roles = {
  username: "test_user_no_roles",
}

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  // -=-=- other code omitted here -=-=-

  describe("POST /", () => {
    createUser(new_user);
    createUser(new_user_no_roles);
  })
});
```

We should also write a test to make sure the process will fail if any required attributes (in this case, just `username`) are missing. We can even check the output to make sure the missing attribute is listed:

```js {title="test/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

/**
 * Fails to create user with missing required attribute
 */
const createUserFailsOnMissingRequiredAttribute = (user, attr) => {
  it("should fail when required attribute '" + attr + "' is missing", (done) => {
    // Create a copy of the user object and delete the given attribute
    const updated_user = {... user}
    delete updated_user[attr]
    request(app)
      .post("/api/v1/users/")
      .send(updated_user)
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("error");
        res.body.should.have.property("errors")
        res.body.errors.should.be.an("array")
        // the error should be related to the deleted attribute
        expect(res.body.errors.some((e) => e.attribute === attr)).to.equal(true);
        done();
      });
  });
}

// -=-=- other code omitted here -=-=-

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  // -=-=- other code omitted here -=-=-

  describe("POST /", () => {
    createUser(new_user);
    createUser(new_user_no_roles);

    createUserFailsOnMissingRequiredAttribute(new_user, "username");
  })
});
```

### Duplicate Username

We also should write a unit test that will make sure we cannot create a user with a duplicate username. 

```js {title="test/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

/**
 * Fails to create user with a duplicate username
 */
const createUserFailsOnDuplicateUsername = (user) => {
  it("should fail on duplicate username '" + user.username + "'", (done) => {
    request(app)
      .post("/api/v1/users/")
      .send(user)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("message");
        res.body.should.have.property("id")
        const created_id = res.body.id
        // Find user in list of all users
        request(app)
          .get("/api/v1/users")
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            const foundUser = res.body.find(
              (u) => u.id === created_id,
            );
            foundUser.should.shallowDeepEqual(user);
            // Try to create same user again
            request(app)
              .post("/api/v1/users/")
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
      });
  });
};


// -=-=- other code omitted here -=-=-

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  // -=-=- other code omitted here -=-=-

  describe("POST /", () => {
    createUser(new_user);
    createUser(new_user_no_roles);

    createUserFailsOnMissingRequiredAttribute(new_user, "username");
    createUserFailsOnDuplicateUsername(new_user);
  })
});
```

This test builds upon the previous `createUser` test by first creating the user, and then confirming that it appears in the output, before trying to create it again. This time, it should fail, so we can borrow some of the code from the `createUserFailsOnMissingRequiredAttribute` to confirm that it is failing because of a duplicate username. 

### Invalid Roles

Finally, we should write a unit test that makes sure a user won't be created if any invalid role IDs are used, and also that the database transaction is properly rolled back so that the user itself isn't created.

```js {title="test/api/v1/users.js"}
// -=-=- other code omitted here -=-=-

/**
 * Fails to create user with bad role ID
 */
const createUserFailsOnInvalidRole = (user, role_id) => {
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
      .post("/api/v1/users/")
      .send(updated_user)
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("object");
        res.body.should.have.property("error");
        // User with invalid roles should not be created
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

/**
 * Test /api/v1/users route
 */
describe("/api/v1/users", () => {
  // -=-=- other code omitted here -=-=-

  describe("POST /", () => {
    createUser(new_user);
    createUser(new_user_no_roles);

    createUserFailsOnMissingRequiredAttribute(new_user, "username");
    createUserFailsOnDuplicateUsername(new_user);

    createUserFailsOnInvalidRole(new_user, 0)
    createUserFailsOnInvalidRole(new_user, -1)
    createUserFailsOnInvalidRole(new_user, 8)
    createUserFailsOnInvalidRole(new_user, "test")
  })
});
```

This test will try to create a valid user, but it appends an invalid role ID to the list of roles to assign to the user. It also confirms that the user itself is not created by querying the get all endpoint and checking for a matching username.

There we go! We have a set of unit tests that cover most of the situations we can anticipate seeing with our route to create new users. If we run all of these tests at this point, they should all pass:

``` {title="output"}
    POST /
      ✔ should successfully create a user 'test_user'
      ✔ should successfully create a user 'test_user_no_roles'
      ✔ should fail when required attribute 'username' is missing
      ✔ should fail on duplicate username 'test_user'
      ✔ should fail when invalid role id '0' is used
      ✔ should fail when invalid role id '-1' is used
      ✔ should fail when invalid role id '8' is used
      ✔ should fail when invalid role id 'test' is used
```

Great! Now is a great time to **lint, format, and then commit and push** our work to GitHub before continuing.