---
title: "Testing Roles"
pre: "5. "
weight: 50
---

{{< youtube ClN_Vp3s5eA >}}

## Unit Testing Roles Routes

Now that we've created a basic unit test for the `/api` route, we can now expand on that to test our other existing route, the `/api/v1/roles` route. Once again, there is only one method inside of this route, the **GET ALL** method, so the unit tests should be similar between these two routes. The only difference here is this route is now reading from the database instead of just returning a static JSON array.

We can begin by creating a new `api` folder inside of the `test` folder, and then a `v1` folder inside of that, and finally a new `roles.js` file to contain our tests. By doing this, the path to our tests match the path to the routes themselves, making it easy to match up the tests with the associated routers.

Inside of that file, we can place the first unit test for the `roles` routes:

```js {title="test/api/v1/roles.js"}
/**
 * @file /api/v1/roles Route Tests
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Load Libraries
import request from "supertest";
import { use, should } from "chai";
import chaiJsonSchemaAjv from "chai-json-schema-ajv";
import chaiShallowDeepEqual from "chai-shallow-deep-equal";
use(chaiJsonSchemaAjv.create({ verbose: true }));
use(chaiShallowDeepEqual);

// Import Express application
import app from "../../../app.js";

// Modify Object.prototype for BDD style assertions
should();

/**
 * Get all Roles
 */
const getAllRoles = () => {
  it("should list all roles", (done) => {
    request(app)
      .get("/api/v1/roles")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.an("array");
        res.body.should.have.lengthOf(7);
        done();
      });
  });
};


/**
 * Test /api/v1/roles route
 */
describe("/api/v1/roles", () => {
  describe("GET /", () => {
    getAllRoles();
  });
});
```

Just like before, this unit test will simply send an HTTP GET request to the `/api/v1/roles` and expect to receive a response that contains an array of 7 elements, which matches the 7 roles defined in the `seeds/01_roles.js` file.

## Adding Additional Formats to AJV

Next, we can create a test to confirm that the structure of that response matches our expectation:

```js {title="test/api/v1/roles.js"}
// -=-=- other code omitted here -=-=-

/**
 * Check JSON Schema of Roles
 */
const getRolesSchemaMatch = () => {
  it("all roles should match schema", (done) => {
    const schema = {
      type: "array",
      items: {
        type: "object",
        required: ["id", "role"],
        properties: {
          id: { type: "number" },
          role: { type: "string" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" }
        },
        additionalProperties: false,
      },
    };
    request(app)
      .get("/api/v1/roles")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema(schema);
        done();
      });
  });
};


/**
 * Test /api/v1/roles route
 */
describe("/api/v1/roles", () => {
  describe("GET /", () => {
    getAllRoles();
    getRolesSchemaMatch();
  });
});
```

However, as we write that test, we might notice that the `createdAt` and `updatedAt` fields are just defined as strings, when really they should be storing a timestamp. Thankfully, the AJV Schema Validator has an extension called [AJV Formats](https://ajv.js.org/packages/ajv-formats.html) that adds many new formats we can use. So, let's install it as a development dependency using `npm`:

```bash {title="terminal"}
$ npm install --save-dev ajv-formats
```

Then, we can add it to AJV at the top of our unit tests and use all of the additional types in the [AJV Formats](https://ajv.js.org/packages/ajv-formats.html) documentation in our tests:

```js {title="test/api/v1/roles.js" hl_lines="9-10 17-21 41-42"}
/**
 * @file /api/v1/roles Route Tests
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Load Libraries
import request from "supertest";
import { use, should } from "chai";
import Ajv from 'ajv'
import addFormats from 'ajv-formats';
import chaiJsonSchemaAjv from "chai-json-schema-ajv";
import chaiShallowDeepEqual from "chai-shallow-deep-equal";

// Import Express application
import app from "../../../app.js";

// Configure Chai and AJV
const ajv = new Ajv()
addFormats(ajv)
use(chaiJsonSchemaAjv.create({ ajv, verbose: true }));
use(chaiShallowDeepEqual);

// Modify Object.prototype for BDD style assertions
should();

// -=-=- other code omitted here -=-=-

/**
 * Check JSON Schema of Roles
 */
const getRolesSchemaMatch = () => {
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
          updatedAt: { type: "string", format: "iso-date-time"  }
        },
        additionalProperties: false,
      },
    };
    request(app)
      .get("/api/v1/roles")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.jsonSchema(schema);
        done();
      });
  });
};

// -=-=- other code omitted here -=-=-
```

Now we can use the `iso-date-time` string format to confirm that the `createdAt` and `updatedAt` fields match the expected format. The [AJV Formats](https://ajv.js.org/packages/ajv-formats.html) package supports a number of helpful formats, such as `email`, `uri`, `uuid`, and more. 

## Testing Each Role

Finally, we should also check that each role we expect to be included in the database is present and accounted for. We can write a single unit test function for this, but we'll end up calling it several times with different roles:

```js {title="test/api/v1/roles.js"}
// -=-=- other code omitted here -=-=-

/**
 * Check Role exists in list
 */
const findRole = (role) => {
  it("should contain '" + role.role + "' role", (done) => {
    request(app)
      .get("/api/v1/roles")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const foundRole = res.body.find(
          (r) => r.id === role.id,
        );
        foundRole.should.shallowDeepEqual(role);
        done();
      });
  });
};

// List of all expected roles in the application
const roles = [ 
  {
    id: 1, 
    role: "manage_users"
  },
  {
    id: 2,
    role: "manage_documents"
  },
  {
    id: 3,
    role: "add_documents"
  },
  {
    id: 4,
    role: "manage_communities"
  },
  {
    id: 5,
    role: "add_communities"
  },
  {
    id: 6,
    role: "view_documents"
  },
  {
    id: 7,
    role: "view_communities"
  }
]

/**
 * Test /api/v1/roles route
 */
describe("/api/v1/roles", () => {
  describe("GET /", () => {
    getAllRoles();
    getRolesSchemaMatch();
    
    roles.forEach( (r) => {
      findRole(r)
    })
  });
});
```

Here we are creating a simple array of roles, which looks similar to the one that is already present in our `seeds/01_roles.js` seed file, but importantly it is **not copied from that file**! Instead, we should go back to the original design documentation for this application, if any, and read the roles from there to make sure they are all correctly added to the database. In this case we don't have an original design document so we won't worry about that here.

With all of that in place, let's run our unit tests and confirm they are working:

```bash {title="terminal"}
$ npm run test
```

If everything is correct, we should find the following in our output showing all tests are successful:

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
```

There we go! We now have working unit tests for our roles. Now is a great time to **lint, format, and then commit and push** our work to GitHub before continuing. Below are a couple of important discussions on unit test structure and design that are highly recommended before continuing.

{{% notice note "Unit Tests Based on Seed Data" %}}

In this application, we are heavily basing our unit tests on the seed data we created in the `seeds` directory. This is a **design choice**, and there are many different ways to approach this in practice:

* Seed data for unit tests could be included as a hook that runs before each unit test
* Unit tests could assume the database is completely blank and manually insert data as needed as part of the test
* Different seed data files could be used for testing and production
* A sample database file or connection could be used for testing instead of seed data

In this case, we believe it makes sense for the application we are testing to have a number of pre-defined roles and users that are populated via seed data when the application is tested and when it is deployed, so we chose to build our unit tests based on the assumption that the existing seed data will be used. However, other application designs may require different testing strategies, so it is always important to consider which method will work best for a given application!

{{% /notice %}}

{{% notice info "Duplicated Unit Test Code" %}}

A keen-eyed observer may notice that the three unit test functions in the `test/api.js` file are nearly identical to the functions included in the `test/api/v1/roles.js` file. This is usually the case in unit testing - there is often a large amount of repeated code used to test different parts of an application, especially a RESTful API like this one.

This leads to two different design options:

* Refactor the code to reduce duplication across unit tests, adding some complexity and interdependence between tests
* Keep duplicated code to make unit tests more readable and independent of each other

For this application, we will follow the second approach. We feel that unit tests are much more useful if the large majority of the test can be easily seen and understood in a single file. This also means that a change in one test method will not impact other tests, both for good and for bad. So, it may mean modifying and updating the entire test suite is a bit more difficult, but updating individual tests should be much simpler. 

Again, this is a **design choice** that we feel is best for this application, and other applications may be better off with other structures. It is always important to consider these implications when writing unit tests for an application!

{{% /notice %}}