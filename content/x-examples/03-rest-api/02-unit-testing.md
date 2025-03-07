---
title: "Unit Testing"
pre: "2. "
weight: 20
---

{{< youtube 0jqhrmsuny0 >}}

## Testing Web APIs

Now that we have created our first route in our RESTful API, we can start to write unit tests that will confirm our API works as intended. Adding unit testing early in the development process makes it much easier to keep up with unit tests as new features are added or even explore [test-driven development](https://en.wikipedia.org/wiki/Test-driven_development)!

There are many libraries that can be used to unit test a RESTful API using Node.js and Express. For this project, we're going to use a number of testing libraries:

* [mocha](https://www.npmjs.com/package/mocha) - Node.js testing framework
* [chai](https://www.npmjs.com/package/chai) - assertion library
* [supertest](https://www.npmjs.com/package/supertest) - HTTP request testing framework
* [ajv](https://www.npmjs.com/package/ajv) - JSON schema validator
* [chai-json-schema-ajv](https://www.npmjs.com/package/chai-json-schema-ajv) - chai plugin for AJV
* [chai-shallow-deep-equal](https://www.npmjs.com/package/chai-shallow-deep-equal) - chai plugin for deep equal assertion

To begin, let's install these libraries as development dependencies in our project using `npm`:

```bash {title="terminal"}
$ npm install --save-dev mocha chai supertest ajv chai-json-schema-ajv chai-shallow-deep-equal
```

Now that we have those libraries in place, let's make a few modifications to our project configuration to make testing more convenient.

{{% notice tip "ESLint Plugin" %}}

To help with formatting and highlighting of our unit tests, we should update the content of our `eslint.config.js` to recognize items from `mocha` as follows:

```js {title="eslint.config.js" hl_lines="7-12"}
import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
    },
    rules: { "no-unused-vars": ["error", { argsIgnorePattern: "next" }] },
  },
  pluginJs.configs.recommended,
];

```

If working properly, this should also fix any errors visible in VS Code using the ESLint plugin!

{{% /notice %}}

## Mocha Root Hooks

In testing frameworks such as `mocha`, we can create `hooks` that contain actions that should be taken before each test is executed in a file. The `mocha` framework also has [root-level hooks](https://mochajs.org/#root-hook-plugins) that are actions to be taken before each and every test in every file. We can use a root-level hook to manage setting up a simple database for unit testing, as well as configuring other aspects of our application for testing.

First, let's create a new `test` directory in our `server` folder, and inside of that we'll create a file `hooks.js` to contain the testing hooks for our application.

```js {title="test/hooks.js"}
/**
 * @file Root Mocha Hooks
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports mochaHooks A Mocha Root Hooks Object
 */

// Load environment (must be first)
import dotenvx from "@dotenvx/dotenvx";
dotenvx.config({path: ".env.test"})

// Import configuration
import database from "../configs/database.js";
import migrations from '../configs/migrations.js';
import seeds from '../configs/seeds.js';

// Root Hook Runs Before Each Test
export const mochaHooks = {

  // Hook runs once before any tests are executed
  beforeAll(done) {
    // Test database connection
    database.authenticate().then(() => {
      // Run migrations
      migrations.up().then(() => {
        done() 
      });
    });
  },
  
  // Hook runs before each individual test
  beforeEach(done) {
    // Seed the database
    seeds.up().then(() => {
      done();
    })
  },

  // Hook runs after each individual test
  afterEach(done) {
    // Remove all data from the database
    seeds.down({to: 0}).then(() => {
      done();
    });
  }
}
```

This file contains three hooks. First, the `beforeAll` hook, which is executed once before any tests are executed, is used to migrate the database. Then, we have the `beforeEach()` hook, which is executed before each individual test, which will seed the database with some sample data for us to use in our unit tests. Finally, we have an `afterEach()` hook that will remove any data from the database by undoing all of the seeds, which will truncate each table in the database.

Notice at the top that we are also loading our environment from a new environment file, `.env.test`. This allows us to use a different environment configuration when we perform testing. So, let's create that file and populate it with the following content:

```env {title=".env.test"}
LOG_LEVEL=error
PORT=3000
OPENAPI_HOST=http://localhost:3000
OPENAPI_VISIBLE=false
DATABASE_FILE=:memory:
SEED_DATA=false
```

Here, the two major changes are to switch the log level to `error` so that we only see errors in the log output, and also to switch the database file to `:memory:` - a special filename that tells SQLite to create an in-memory database that is excellent for testing. 

At this point, we can start writing our unit tests.

## Writing Basic Unit Tests

Let's start with a very simple case - the `/api` route we created earlier. This is a simple route that only has a single method and outputs a single item, but it already clearly demonstrates how complex unit testing can become.

For these unit tests, we can create a file `api.js` in the `test` folder with the following content:

```js {title="test/api.js"}
/**
 * @file /api Route Tests
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Load Libraries
import request from 'supertest'
import { use, should } from 'chai'
import chaiJsonSchemaAjv from 'chai-json-schema-ajv'
import chaiShallowDeepEqual from 'chai-shallow-deep-equal'
use(chaiJsonSchemaAjv.create({ verbose: true }))
use(chaiShallowDeepEqual)

// Import Express application
import app from '../app.js';

// Modify Object.prototype for BDD style assertions
should()
```

These lines will import the various libraries required for these unit tests. We'll explore how they work as we build the unit tests, but it is also recommended to read the documentation for each library (linked above) to better understand how each one works together in the various unit tests.

Now, let's write our first unit test, which can be placed right below those lines in the same file:

```js {title="test/api.js"}
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
        res.body.should.have.lengthOf(1)
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
  })
})
```

This code looks quite a bit different than the code we've been writing so far. This is because the `mocha` and `chai` libraries use the [Behavior-Driven Development](https://en.wikipedia.org/wiki/Behavior-driven_development), or BDD, style for writing unit tests. The core idea is that the unit tests should be somewhat "readable" by anyone looking at the code. So, it defines functions such as `it` and `describe` that are used to structure the unit tests.

In this example, the `getAllVersions` function is a unit test function that uses the `request` library to send a request to our Express `app` at the `/api/` path. When the response is received from that request, we expect the HTTP status code to be 200, and the body of that request should be an array with a length of 1. Hopefully it is clear to see all of that just by reading the code in that function. 

The other important concept is the special `done` function, which is provided as an argument to any unit test function that is testing [asynchronous code](https://mochajs.org/#asynchronous-code). Because of the way asynchronous code is handled, the system cannot automatically determine when all promises have been returned. So, once we are done with the unit test and are not waiting for any further async responses, we need to call the `done()` method. Notice that we call that both at the end of the function, but also in the `if` statement that checks for any errors returned from the HTTP request. 

Finally, at the bottom of the file, we have a few `describe` statements that actually build the structure that runs each unit test. When the tests are executed, only functions called inside of the `describe` statements will be executed.

## Running Unit Tests

Now that we have created a simple unit test, let's run it using the `mocha` test framework. To do this, we'll add a new script to the `package.json` file with all of the appropriate options:

```json {title="package.json" hl_lines="8"}
{
  ...
  "scripts": {
    "start": "LOG_LEVEL=http node ./bin/www",
    "dev": "nodemon ./bin/www",
    "lint": "npx eslint --fix .",
    "format": "npx prettier . --write",
    "test": "mocha --require test/hooks.js --recursive --parallel --timeout 2000 --exit"
  },
  ...
}
```

Here, we are using the `mocha` command with many options:
* `--require test/hooks.js` - this requires the global hooks file to be used before each test
* `--recursive` - this will recursively look for any tests in subdirectories
* `--parallel` - this allows tests to run in parallel (this requires the SQLite in-memory database)
* `--timeout 2000` - this will stop any test if it runs for more than 2 seconds
* `--exit` - this forces Mocha to stop after all tests have finished

So, now let's run our tests using that script:

```bash {title="terminal"}
$ npm run test
```

If everything is working correctly, we should get the following output:

``` {title="output"}
> lost-communities-solution@0.0.1 test
> mocha --require test/hooks.js --recursive --parallel --timeout 2000 --exit

[dotenvx@1.34.0] injecting env (6) from .env.test

[dotenvx@1.34.0] injecting env (0) from .env.test
[dotenvx@1.34.0] injecting env (0) from .env

  /api
    GET /
      ✔ should list all API versions


  1 passing (880ms)
```

Great! It looks like our test already passed! 

Just to be sure, let's quickly modify our test to look for an array of size `2` so that it should fail:

```js {title="test/api.js" hl_lines="14"}
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
```

Now, when we run the tests, we should clearly see a failure report instead:

``` {title="output"}
> lost-communities-solution@0.0.1 test
> mocha --require test/hooks.js --recursive --parallel --timeout 2000 --exit

[dotenvx@1.34.0] injecting env (6) from .env.test

[dotenvx@1.34.0] injecting env (0) from .env.test
[dotenvx@1.34.0] injecting env (0) from .env

  /api
    GET /
      1) should list all API versions


  0 passing (910ms)
  1 failing

  1) /api
       GET /
         should list all API versions:

      Uncaught AssertionError: expected [ { version: '1.0', url: '/api/v1/' } ] to have a length of 2 but got 1
      + expected - actual

      -1
      +2
      
      at Test.<anonymous> (file:///workspaces/lost-communities-solution/server/test/api.js:31:30)
      at Test.assert (node_modules/supertest/lib/test.js:172:8)
      at Server.localAssert (node_modules/supertest/lib/test.js:120:14)
      at Object.onceWrapper (node:events:638:28)
      at Server.emit (node:events:524:28)
      at emitCloseNT (node:net:2383:8)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21)
```

Thankfully, anytime a test fails, we get a very clear and easy to follow error report that pinpoints exactly which line in the test failed, and how the assertion was not met.

Before moving on, let's update our test so that it should pass again.