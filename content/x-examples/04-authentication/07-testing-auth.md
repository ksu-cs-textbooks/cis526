---
title: "Testing Authentication"
pre: "7. "
weight: 70
---

{{< youtube id >}}

## Testing Authentication Routes

Now that we have our authentication system working for our application, let's write some unit tests to confirm that it works as expected in a variety of situations. 

As part of these tests, we'll end up creating a [test double](https://en.wikipedia.org/wiki/Test_double) of one part of our authentication system to make it easier to test. To do this, we'll use the [Sinon](https://sinonjs.org/) library, so let's start by installing it as a development dependency:

```bash {title="terminal"}
$ npm install --save-dev sinon
```

We'll store these tests in the `test/auth.js` file, starting with this content including the libraries we'll need to use:

```js {title="test/auth.js"}
/**
 * @file /auth Route Tests
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Load Libraries
import request from "supertest";
import { use, should, expect } from "chai";
import chaiJsonSchemaAjv from "chai-json-schema-ajv";
import chaiShallowDeepEqual from "chai-shallow-deep-equal";
import sinon from "sinon";
import jsonwebtoken from "jsonwebtoken";
use(chaiJsonSchemaAjv.create({ verbose: true }));
use(chaiShallowDeepEqual);

// Import Express application
import app from "../app.js";

// Import Database
import { User, Role } from "../models/models.js";

// Modify Object.prototype for BDD style assertions
should();
```

We'll continue to build out tests below that content in the same file.

### Testing Bypass Authentication

First, let's look at some tests for the `/auth/bypass` route, since that is the simplest. The first test is a very simple one to confirm that bypass authentication works, and also that it sets the expected cookie in the browser when it redirects the user back to the home page:

```js {title="test/auth.js"}
// -=-=- other code omitted here -=-=-

// Regular expression to match the expected cookie
const regex_valid = "^" + process.env.SESSION_NAME + "=\\S*; Path=/; HttpOnly$";

/**
 * Test Bypass authentication
 */
const bypassAuth = (user) => {
  it("should allow bypass login with user " + user, (done) => {
    const re = new RegExp(regex_valid, "gm");
    request(app)
      .get("/auth/bypass?token=" + user)
      .expect(302)
      .expect("Location", "/")
      .expect("set-cookie", re)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

// List of existing users to be tested
const users = ["admin", "contributor", "manager", "user"];

/**
 * Test /auth/ routes
 */
describe("/auth", () => {
  describe("GET /bypass", () => {
    users.forEach((user) => {
      bypassAuth(user);
    });
  });
});
```

Notice that we are using a [regular expression](https://en.wikipedia.org/wiki/Regular_expression) to help us verify that the cookie being sent to the user is using the correct name and has the expected content. 

Next, we also should test to make sure that using bypass authentication with any unknown username will create that user:

```js {title="test/auth.js"}
// -=-=- other code omitted here -=-=-

/**
 * Test Bypass authentication creates user
 */
const bypassAuthCreatesUser = (user) => {
  it("should allow bypass login with new user " + user, (done) => {
    const re = new RegExp(regex_valid, "gm");
    request(app)
      .get("/auth/bypass?token=" + user)
      .expect(302)
      .expect("Location", "/")
      .expect("set-cookie", re)
      .end((err) => {
        if (err) return done(err);
        User.findOne({
          attributes: ["id", "username"],
          where: { username: user },
        }).then((found_user) => {
          expect(found_user).to.not.equal(null);
          found_user.should.have.property("username");
          expect(found_user.username).to.equal(user);
          done();
        });
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /auth/ routes
 */
describe("/auth", () => {
  describe("GET /bypass", () => {
    users.forEach((user) => {
      bypassAuth(user);
    });
    bypassAuthCreatesUser("testuser");
  });
});
```

This test will first log the user in, then it will directly check the database to ensure that the user has been created successfully. Alternatively, we could also use the API, but we're trying to keep our tests independent, so in this case it makes the most sense to query the database directly in our test instead of any other method.

### Testing CAS Authentication

Next, let's write the tests for our CAS authentication strategy. These are similar to the ones we've already written, but they have some key differences as well.

First, we can write a simple test just to show that any user who visits the `/auth/cas` route will be properly redirected to the correct CAS server:

```js {title="test/auth.js"}
// -=-=- other code omitted here -=-=-

/**
 * Test CAS authentication redirect
 */
const casAuthRedirect = () => {
  it("should redirect users to CAS server", (done) => {
    const expectedURL =
      process.env.CAS_URL +
      "/login?service=" +
      encodeURIComponent(process.env.CAS_SERVICE_URL + "/auth/cas");
    request(app)
      .get("/auth/cas")
      .expect(302)
      .expect("Location", expectedURL)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /auth/ routes
 */
describe("/auth", () => {
  // -=-=- other code omitted here -=-=-

  describe("GET /cas", () => {
    casAuthRedirect();
  });
});
```

In this test, we are building the URL that the user should be redirected to, based on the settings we have already set in our environment file. Then, we simply check that the returned response is an HTTP 302 Found response with the correct location indicated.

The next two tests are much more complex, because they require us to mock the step where our server confirms that the user is authenticated with the CAS server by sending a request with a ticket attached, and then getting a response for that ticket. We can do this using a bit of clever coding and the [Sinon] library.

First, we need to mock up a response object that mimics what the server would respond with. This is mocked just so it will be understood by our CAS authentication library and may not work in all cases:

```js {title="test/auth.js"}
// -=-=- other code omitted here -=-=-

/**
 * Helper function to generate a valid mock CAS 2.0 Ticket
 */
const validTicket = (user, ticket) => {
  return {
    text: () => {
      return `<cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'>
          <cas:authenticationSuccess>
              <cas:user>${user}</cas:user>
              <cas:ksuPersonWildcatID>${123456789}</cas:ksuPersonWildcatID>
              <cas:proxyGrantingTicket>${ticket}</cas:proxyGrantingTicket>
          </cas:authenticationSuccess>
        </cas:serviceResponse>`;
    },
  };
};

// -=-=- other code omitted here -=-=-
```

This function creates an object with a single method `text()` that will return a valid XML ticket for the given user and random ticket ID. 

Right below that, we can create a unit test that will mock the global `fetch` function used by our CAS authentication strategy to contact the CAS server to validate the ticket, and instead it will respond with our mock response object created above:

```js {title="test/auth.js"}
// -=-=- other code omitted here -=-=-

/**
 * Test CAS with valid ticket
 */
const casAuthValidTicket = (user) => {
  it("should log in user " + user + " via CAS", (done) => {
    const ticket = "abc123";
    const fetchStub = sinon
      .stub(global, "fetch")
      .resolves(validTicket(user, ticket));
    const re = new RegExp(regex_valid, "gm");
    request(app)
      .get("/auth/cas?ticket=" + ticket)
      .expect(302)
      .expect("Location", "/")
      .expect("set-cookie", re)
      .end((err) => {
        if (err) return done(err);
        sinon.assert.calledOnce(fetchStub);
        expect(fetchStub.args[0][0]).to.contain("?ticket=" + ticket);
        done();
      });
  });
};

// -=-=- other code omitted here -=-=-

// Restore sinon stubs after each test
afterEach(() => {
  sinon.restore();
});

/**
 * Test /auth/ routes
 */
describe("/auth", () => {
  // -=-=- other code omitted here -=-=-

  describe("GET /cas", () => {
    casAuthRedirect();
    users.forEach((user) => {
      casAuthValidTicket(user);
    });
  });
});
```

In this test, we create a `fetchStub` object that is used by our CAS authentication strategy in place of `fetch`. It will confirm that the user has a valid ticket and can be authenticated, so we can perform the same steps as before and ensure that the cookie is properly set when the user is authenticated.

We also are checking that the `fetch` method we mocked was actually called once, and that it contained the ticket we provided as part of the URL. This is just a sanity check to make sure that we mocked up the correct part of our application!

We must also add a new `afterEach()` hook for Mocha, which will reset all functions and objects that are mocked by Sinon after each test. This ensures we are always working with a clean slate.

Finally, we also should confirm that logging in via CAS will create a new user if the username is not recognized. This test builds upon the previous CAS test in a way similar to the one used for bypass authentication above:

```js {title="test/auth.js"}
// -=-=- other code omitted here -=-=-

/**
 * Test CAS creates user
 */
const casAuthValidTicketCreatesUser = (user) => {
  it("should create new user " + user + " via CAS", (done) => {
    const ticket = "abc123";
    const fetchStub = sinon
      .stub(global, "fetch")
      .resolves(validTicket(user, ticket));
    const re = new RegExp(regex_valid, "gm");
    request(app)
      .get("/auth/cas?ticket=" + ticket)
      .expect(302)
      .expect("Location", "/")
      .expect("set-cookie", re)
      .end((err) => {
        if (err) return done(err);
        sinon.assert.calledOnce(fetchStub);
        expect(fetchStub.args[0][0]).to.contain("?ticket=" + ticket);
        User.findOne({
          attributes: ["id", "username"],
          where: { username: user },
        }).then((found_user) => {
          expect(found_user).to.not.equal(null);
          found_user.should.have.property("username");
          expect(found_user.username).to.equal(user);
          done();
        });
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /auth/ routes
 */
describe("/auth", () => {
  // -=-=- other code omitted here -=-=-

  describe("GET /cas", () => {
    casAuthRedirect();
    users.forEach((user) => {
      casAuthValidTicket(user);
    });
    casAuthValidTicketCreatesUser("testuser");
  });
});
```

As before, this will log a user in via CAS, confirm that it works, and then check in the database to make sure that the new user is properly created.

### Testing JWT

Now that we've tested both ways to log into our application, we can write some tests to confirm that users can properly request a JWT to be used in our frontend later on. So, our first test simply checks to make sure a user with a valid session can request a token:

```js {title="test/auth.js"}
// -=-=- other code omitted here -=-=-

/**
 * Test user can request a valid token
 */
const userCanRequestToken = (user) => {
  it("should allow user " + user + " to request valid JWT", (done) => {
    const re = new RegExp(regex_valid, "gm");
    const agent = request.agent(app);
    agent
      .get("/auth/bypass?token=" + user)
      .expect(302)
      .expect("Location", "/")
      .expect("set-cookie", re)
      .end((err) => {
        if (err) return done(err);
        agent
          .get("/auth/token")
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            res.body.should.be.an("object");
            res.body.should.have.property("token");
            const token = jsonwebtoken.decode(res.body.token);
            token.should.have.property("username");
            token.username.should.be.equal(user);
            done();
          });
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /auth/ routes
 */
describe("/auth", () => {
  // -=-=- other code omitted here -=-=-

  describe("GET /token", () => {
    users.forEach((user) => {
      userCanRequestToken(user);
    });
    userCanRequestToken("testuser");
  });
});
```

In this test, we must use a persistent browser agent to make our requests. This will ensure that any cookies or other settings are saved between requests. Thankfully, the [Supertest](https://www.npmjs.com/package/supertest) library we are using already has that functionality, so all we have to do is create an `agent` for our testing as shown in the test above. Once we have successfully logged in, we can confirm that the `/auth/token` endpoint sends a valid JWT that contains information about the current user. For these tests, we are using bypass authentication for simplicity, but any authentication method could be used.

When we run the tests at the bottom of the file, notice that we are running this for all existing users, as well as a newly created user. Both types of users should be able to request a token for our application.

Next, let's confirm that all of a user's roles are listed in the JWT issued for that user. This is important because, later on in this example, we'll be using those roles to implement role-based authorization in our application, so it is vital to make sure our JWTs include the correct roles:

```js {title="test/auth.js"}
// -=-=- other code omitted here -=-=-

/**
 * Test user roles are correctly listed in token
 */
const userRolesAreCorrectInToken = (user) => {
  it("should contain correct roles for user " + user + " in JWT", (done) => {
    const re = new RegExp(regex_valid, "gm");
    const agent = request.agent(app);
    agent
      .get("/auth/bypass?token=" + user)
      .expect(302)
      .expect("Location", "/")
      .expect("set-cookie", re)
      .end((err) => {
        if (err) return done(err);
        agent
          .get("/auth/token")
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            res.body.should.be.an("object");
            res.body.should.have.property("token");
            const token = jsonwebtoken.decode(res.body.token);
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
              where: { username: user },
            }).then((user) => {
              if (user.roles.length != 0) {
                token.should.have.property("roles");
                expect(token.roles.length).to.equal(user.roles.length);
                user.roles.forEach((expected_role) => {
                  expect(
                    token.roles.some((role) => role.id == expected_role.id),
                  ).to.equal(true);
                });
              } else {
                token.should.not.have.property("roles");
              }
              done();
            });
          });
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /auth/ routes
 */
describe("/auth", () => {
  // -=-=- other code omitted here -=-=-

  describe("GET /token", () => {
    users.forEach((user) => {
      userCanRequestToken(user);
      userRolesAreCorrectInToken(user);
    });
    userCanRequestToken("testuser");
    userRolesAreCorrectInToken("testuser");
  });
});
```

This test may seem very long and verbose, but it is very straightforward. We first login and request a token for a user, and then we also look up that user in the database including all associated roles. Then, we simply assert that the number of roles in the token is the same as the number of them in the database, and if there are any roles that each role is found as expected. 

Finally, we should write one additional test, that simply confirms that the application will not allow anyone to request a token if they are not currently logged in:

```js {title="test/auth.js"}
// -=-=- other code omitted here -=-=-

/**
 * User must have a valid session to request a token
 */
const mustBeLoggedInToRequestToken = () => {
  it("should not allow a user to request a token without logging in", (done) => {
    request(app)
      .get("/auth/token")
      .expect(401)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /auth/ routes
 */
describe("/auth", () => {
  // -=-=- other code omitted here -=-=-

  describe("GET /token", () => {
    users.forEach((user) => {
      userCanRequestToken(user);
      userRolesAreCorrectInToken(user);
    });
    userCanRequestToken("testuser");
    userRolesAreCorrectInToken("testuser");
    mustBeLoggedInToRequestToken();
  });
});
```

For this test, we simply check that the application returns an HTTP 401 response if the user tries to request a token without first being logged in.

### Testing Logout

Finally, we can write a few tests to make sure our logout process is also working as expected. The first test will confirm that the session cookie we are using is properly removed from the user's browser when they log out:

```js {title="test/auth.js"}
// -=-=- other code omitted here -=-=-

// Regular expression to match deleting the cookie
const regex_destroy =
  "^" +
  process.env.SESSION_NAME +
  "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT$";

/**
 * Logout will remove the cookie
 */
const logoutDestroysCookie = (user) => {
  it("should remove the cookie on logout", (done) => {
    const re = new RegExp(regex_valid, "gm");
    const re_destroy = new RegExp(regex_destroy, "gm");
    const agent = request.agent(app);
    agent
      .get("/auth/bypass?token=" + user)
      .expect(302)
      .expect("Location", "/")
      .expect("set-cookie", re)
      .end((err) => {
        if (err) return done(err);
        agent
          .get("/auth/logout")
          .expect(302)
          .expect("set-cookie", re_destroy)
          .end((err) => {
            if (err) return done(err);
            done();
          });
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /auth/ routes
 */
describe("/auth", () => {
  // -=-=- other code omitted here -=-=-

  describe("GET /logout", () => {
    logoutDestroysCookie("admin");
  });
});
```

In this test, we are looking for a second `set-cookie` header to be sent when the user logs out. This header will both contain an empty cookie, but also will set the cookie's expiration date to the earliest date possible. So, we can simply look for that header to confirm our cookie is being properly removed and expired from the user's browser when they log out. We only really have to test this for a single username, since the process is identical for all of them.

Next, we should also confirm that the logout process will redirect users to the CAS server as well and log them out of any existing CAS sessions.

```js {title="test/auth.js"}
// -=-=- other code omitted here -=-=-

// Regular expression for redirecting to CAS
const regex_redirect = "^" + process.env.CAS_URL + "/logout\\?service=\\S*$";

/**
 * Logout redirects to CAS
 */
const logoutRedirectsToCas = (user) => {
  it("should redirect to CAS on logout", (done) => {
    const re = new RegExp(regex_valid, "gm");
    const re_redirect = new RegExp(regex_redirect, "gm");
    const agent = request.agent(app);
    agent
      .get("/auth/bypass?token=" + user)
      .expect(302)
      .expect("Location", "/")
      .expect("set-cookie", re)
      .end((err) => {
        if (err) return done(err);
        agent
          .get("/auth/logout")
          .expect(302)
          .expect("Location", re_redirect)
          .end((err) => {
            if (err) return done(err);
            done();
          });
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /auth/ routes
 */
describe("/auth", () => {
  // -=-=- other code omitted here -=-=-

  describe("GET /logout", () => {
    logoutDestroysCookie("admin");
    logoutRedirectsToCas("admin");
  });
});
```

Once again, we are simply checking the `Location` header of the HTTP 302 Found response received from our application. We are making use of regular expressions to ensure we are being properly redirected to the correct CAS server and the `logout` route on that server.

Finally, we should confirm that once a user has logged out, they are no longer able to request a new token from the application:

```js {title="test/auth.js"}
// -=-=- other code omitted here -=-=-

/**
 * Logout prevents requesting a token
 */
const logoutPreventsToken = (user) => {
  it("should prevent access to token after logging out", (done) => {
    const re = new RegExp(regex_valid, "gm");
    const agent = request.agent(app);
    agent
      .get("/auth/bypass?token=" + user)
      .expect(302)
      .expect("Location", "/")
      .expect("set-cookie", re)
      .end((err) => {
        if (err) return done(err);
        agent
          .get("/auth/token")
          .expect(200)
          .end((err) => {
            if (err) return done(err);
            agent
              .get("/auth/logout")
              .expect(302)
              .end((err) => {
                if (err) return done(err);
                agent
                  .get("/auth/token")
                  .expect(401)
                  .end((err) => {
                    if (err) return done(err);
                    done();
                  });
              });
          });
      });
  });
};

// -=-=- other code omitted here -=-=-

/**
 * Test /auth/ routes
 */
describe("/auth", () => {
  // -=-=- other code omitted here -=-=-

  describe("GET /logout", () => {
    logoutDestroysCookie("admin");
    logoutRedirectsToCas("admin");
    logoutPreventsToken("admin");
  });
});
```

In this test, we simply log in, request a token, then log out, and show that the application will no longer allow us to request a token, even though we are using the same user agent as before. This is a great way to confirm that our entire process is working!

Now is a great time to lint, format, and commit our code to GitHub before continuing!