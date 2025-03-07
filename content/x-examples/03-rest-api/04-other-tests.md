---
title: "Other Tests"
pre: "4. "
weight: 40
---

{{< youtube ENWHzaMXMMk >}}

## Testing for Other Issues

Let's consider the scenario where our `routes/api.js` file was modified slightly to have some incorrect code in it:

```js {title="routes/api.js"}
// -=-=- other code omitted here -=-=-
router.get('/', function (req, res, next) {
  res.json([
    {
      versoin: "1.0",
      url: "/api/ver1/"
    }
  ])
})
```

In this example, we have misspelled the `version` attribute, and also used an incorrect URL for that version of the API. Unfortunately, if we actually make that change to our code, our existing unit test will not catch either error!

So, let's look at how we can go about catching these errors and ensuring our unit tests are actually valuable.

## JSON Schemas

First, it is often helpful to validate the schema of the JSON output by our API. To do that, we've installed the `ajv` JSON schema validator and a `chai` plugin for using it in a unit test. So, in our `test/api.js` file, we can add a new test:

```js {title="test/api.js"}
// -=-=- other code omitted here -=-=-

/**
 * Check JSON Schema of API Versions
 */
const getAllVersionsSchemaMatch = () => {
  it('all API versions should match schema', (done) => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        required: ['version', 'url'],
        properties: {
          version: { type: 'string' },
          url: { type: 'string' },
        },
        additionalProperties: false,
      },
    }
    request(app)
      .get('/api/')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.should.be.jsonSchema(schema)
        done()
      })
  })
}

/**
 * Test /api route
 */
describe('/api', () => {
  describe('GET /', () => {
    getAllVersions()
    getAllVersionsSchemaMatch()
  })
})
```

In this test, we create a JSON schema following the [AJV Instructions](https://ajv.js.org/json-schema.html) that defines the various attributes that should be present in the output. It is especially important to include the `additionalProperties: false` line, which helps prevent leaking any unintended attributes. 

Now, when we run our tests, we should see that this test fails:

``` {title="output"}
  /api
    GET /
      ✔ should list all API versions
      1) all API versions should match schema


  1 passing (1s)
  1 failing

  1) /api
       GET /
         all API versions should match schema:
     Uncaught AssertionError: expected [ { versoin: '1.0', …(1) } ] to match json-schema
[ { instancePath: '/0', …(7) } ]
      at Test.<anonymous> (file:///workspaces/lost-communities-solution/server/test/api.js:59:28)
...
```

As we can see, the misspelled `version` attribute will not match the given schema, causing the test to fail! That shows the value of such a unit test in our code.

## Protecting Attributes

Let's update our route to include the correct attributes, but also add an additional item that shouldn't be present in the output:

```js {title="routes/api.js"}
// -=-=- other code omitted here -=-=-
router.get('/', function (req, res, next) {
  res.json([
    {
      version: "1.0",
      url: "/api/ver1/",
      secure_data: "This should not be shared!"
    }
  ])
})
```

This is an example of [Broken Object Properly Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/), one of the top 10 most common API security risks according to OWASP. Often our database models will include attributes that we don't want to expose to our users, so we want to make sure they aren't included in the output by accident.

If we run our test again, it should also fail:

``` {title="output"}
  /api
    GET /
      ✔ should list all API versions
      1) all API versions should match schema


  1 passing (1s)
  1 failing

  1) /api
       GET /
         all API versions should match schema:
     Uncaught AssertionError: expected [ { version: '1.0', …(2) } ] to match json-schema
[ { instancePath: '/0', …(7) } ]
      at Test.<anonymous> (file:///workspaces/lost-communities-solution/server/test/api.js:59:28)
...
```

However, if we remove the line `additionalProperties: false` from our JSON schema unit test, it will now succeed. So, it is always important for us to remember to include that line in all of our JSON schemas if we want to avoid this particular security flaw.

## Checking Values

However, we still have not caught our incorrect value in our API output:

```js {title="routes/api.js"}
// -=-=- other code omitted here -=-=-
router.get('/', function (req, res, next) {
  res.json([
    {
      version: "1.0",
      url: "/api/ver1/",
      secure_data: "This should not be shared!"
    }
  ])
})
```

For this, we need to write one additional unit test to check the actual content of the output. For this, we'll use a deep equality plugin for `chai`:

```js {title="test/api.js"}
// -=-=- other code omitted here -=-=-

/**
 * Check API version exists in list
 */
const findVersion = (version) => {
  it('should contain specific version', (done) => {
    request(app)
      .get('/api/')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const foundVersion = res.body.find((v) => v.version === version.version)
        foundVersion.should.shallowDeepEqual(version)
        done()
      })
  })
}

/**
 * Test /api route
 */
describe('/api', () => {
  describe('GET /', () => {
    getAllVersions()
    getAllVersionsSchemaMatch()
  })

  describe('version: 1.0', () => {
    const version = {
      version: "1.0",
      url: "/api/v1/"
    }

    describe('GET /', () => {
      findVersion(version)
    })
  })
})
```

The `findVersion` unit test will check the actual contents of the output received from the API and compare it to the `version` object that is provided as input. In our `describe` statements below, we can see how easy it is to define a simple version object that we can use to compare to the output. 

{{% notice note "Use the Source!" %}}

One common mistake when writing these unit tests is to simply copy the object structure from the code that is being tested. This is considered **bad practice** since it virtually guarantee that any typos or mistakes are not caught. Instead, when constructing these unit tests, we should always go back to the original source document, typically a design document or API specification, and build our unit tests using that as a guide. This will ensure that our tests will actually catch things such as typos or missing data.

{{% /notice %}}

With that test in place, we should once again have a unit test that fails:

``` {title="output"}
  /api
    GET /
      ✔ should list all API versions
      ✔ all API versions should match schema
    version: 1.0
      GET /
        1) should contain specific version


  2 passing (987ms)
  1 failing

  1) /api
       version: 1.0
         GET /
           should contain specific version:

      Uncaught AssertionError: Expected to have "/api/v1/" but got "/api/ver1/" at path "/url".
      + expected - actual

       {
      -  "url": "/api/ver1/"
      +  "url": "/api/v1/"
         "version": "1.0"
       }
      
      at Test.<anonymous> (file:///workspaces/lost-communities-solution/server/test/api.js:76:29)
```

Thankfully, in the output we clearly see the error, and it is easy to go back to our original design document to correct the error in our code.

## Reusing Tests

While it may seem like we are using a very complex structure for these tests, there is actually a very important reason behind it. If done correctly, we can easily reuse most of our tests as we add additional data to the application.

Let's consider the scenario where we add a second API version to our output:

```js {title="routes/api.js"}
// -=-=- other code omitted here -=-=-
router.get('/', function (req, res, next) {
  res.json([
    {
      version: "1.0",
      url: "/api/v1/"
    },
    {
      version: "2.0",
      url: "/api/v2/"
    }
  ])
})
```

To fully test this, all we need to do is update the array size in the `getAllVersions` and add an additional `describe` statement for the new version:

```js {title="test/api.js" hl_lines="14 42-50"}
// -=-=- other code omitted here -=-=-

/**
 * Get all API versions
 */
const getAllVersions = () => {
  it('should list all API versions', (done) => {
    request(app)
      .get('/api/')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.should.be.an('array')
        res.body.should.have.lengthOf(2)
        done()
      })
  })
}

// -=-=- other code omitted here -=-=-

/**
 * Test /api route
 */
describe('/api', () => {
  describe('GET /', () => {
    getAllVersions()
    getAllVersionsSchemaMatch()
  })

  describe('version: 1.0', () => {
    const version = {
      version: "1.0",
      url: "/api/v1/"
    }

    describe('GET /', () => {
      findVersion(version)
    })
  })

  describe('version: 2.0', () => {
    const version = {
      version: "2.0",
      url: "/api/v2/"
    }

    describe('GET /', () => {
      findVersion(version)
    })
  })
})
```

With those minor changes, we see that our code now passes all unit tests:

``` {title="output"}
  /api
    GET /
      ✔ should list all API versions
      ✔ all API versions should match schema
    version: 1.0
      GET /
        ✔ should contain specific version
    version: 2.0
      GET /
        ✔ should contain specific version
```

By writing reusable functions for our unit tests, we can often deduplicate and simplify our code.

Before moving on, let's roll back our unit tests and the API to just have a single version. We should make sure all tests are passing before we move ahead!

