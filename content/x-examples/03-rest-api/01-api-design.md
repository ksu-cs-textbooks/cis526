---
title: "API Design"
pre: "1. "
weight: 10
---

{{< youtube id >}}

## Good API Design

There are many articles online that discuss best practices in API design. For this project, we're going to follow a few of the most common recommendations:

* [API Versioning](https://www.postman.com/api-platform/api-versioning/)
* [Proper Naming Conventions](https://restfulapi.net/resource-naming/)
* [Proper HTTP Methods](https://restfulapi.net/http-methods/)
* [Proper HTTP Status Code Responses](https://restfulapi.net/http-status-codes/)

Let's start with the first one - we can easily add a version number to our API's URL paths. This allows us to make breaking changes to the API in the future without breaking any of the current functionality. 

## API Versioning

Our current application contains data for both a `User` and a `Role` model. For this example, we'll begin by adding a set of RESTful API routes to work with the `Role` model. In order to add proper versioning to our API, we will want these routes visible at the `/api/v1/roles` path. 

First, we should create the folder structure inside of our `routes` folder to match the routes used in our API. This means we'll create an `api` folder, then a `v1` folder, and finally a `roles.js` file inside of that folder:

![API Folder Paths](images/examples/03/api_1.png)

Before we create the content in that file, let's also create a new file in the base `routes` folder named `api.js` that will become the base file for all of our API routes:

```js {title="routes/api.js"}
/**
 * @file API main router
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: api
 *   description: API routes
 */

// Import libraries
import express from "express";

// Import v1 routers
import rolesRouter from "./api/v1/roles.js"

// Create Express router
const router = express.Router();

// Use v1 routers
router.use("/v1/roles", rolesRouter);

/**
 * Gets the list of API versions
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/:
 *   get:
 *     summary: list API versions
 *     tags: [api]
 *     responses:
 *       200:
 *         description: the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   version:
 *                     type: string
 *                   url: 
 *                     type: string
 *             example:
 *               - version: "1.0"
 *                 url: /api/v1/
 */
router.get('/', function (req, res, next) {
  res.json([
    {
      version: "1.0",
      url: "/api/v1/"
    }
  ])
})

export default router
```

This file is very simple - it just outputs all possible API versions (in this case, we just have a single API version). It also imports and uses our new `roles` router. Finally, it includes some basic Open API documentation for the route it contains. Let's quickly add some basic content to our `roles` router, based on the existing content in our `users` router from before:

```js {title="routes/api/v1/roles.js"}
/**
 * @file Roles router
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: roles
 *   description: Roles Routes
 */

// Import libraries
import express from "express";

// Create Express router
const router = express.Router();

// Import models
import { Role } from "../../../models/models.js";

// Import logger
import logger from "../../../configs/logger.js"

/**
 * Gets the list of roles
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: roles list page
 *     description: Gets the list of all roles in the application
 *     tags: [roles]
 *     responses:
 *       200:
 *         description: the list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
router.get("/", async function (req, res, next) {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    logger.error(error)
    res.status(500).end()
  }
});

export default router;
```

Notice that we have added an additional `try` and `catch` block to the route function. This will ensure any errors that are thrown by the database get caught and logged without leaking any sensitive data from our API. It is always a good practice to wrap each API method in a `try` and `catch` block.

{{% notice note "Controllers and Services" %}}

More complex RESTful API designs may include additional files such as **controllers** and **services** to add additional structure to the application. For example, there might be multiple API routes that access the same method in a controller, which then uses a service to perform business logic on the data before storing it in the database. 

For this example project, we will place most of the functionality directly in our routes to simplify our structure. 

You can read more about how to use controllers and services in the [MDN Express Tutorial](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/routes).

{{% /notice %}}

Since we are creating routes in a new subfolder, we also need to update our Open API configuration in `configs/openapi.js` so that we can see the documentation contained in those routes:

```js {title="configs/openapi.js" hl_lines="18"}
// -=-=- other code omitted here -=-=-

// Configure SwaggerJSDoc options
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Lost Communities",
      version: "0.0.1",
      description: "Kansas Lost Communities Project",
    },
    servers: [
      {
        url: url(),
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js", ".routes/api/v1/*.js"],
};

export default swaggerJSDoc(options);

```

Now that we've created these two basic routers, let's get them added to our `app.js` file so they are accessible to the application:

```js {title="app.js" hl_lines="6 27"}
// -=-=- other code omitted here -=-=-

// Import routers
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import apiRouter from "./routes/api.js";

// Create Express application
var app = express();

// Use libraries
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(compression());
app.use(cookieParser());

// Use middlewares
app.use(requestLogger);

// Use static files
app.use(express.static(path.join(import.meta.dirname, "public")));

// Use routers
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

// -=-=- other code omitted here -=-=-
```

Now, with everything in place, let's run our application and see if we can access that new route at `/api/v1/roles`:

```bash {title="terminal"}
$ npm run dev
```

If everything is working correctly, we should see our roles listed in the output on that page:

![List of Roles](images/examples/03/api_2.png)

We should also be able to query the list of API versions at the path `/api`:

![List of API Versions](images/examples/03/api_3.png)

Finally, we should also check and make sure our Open API documentation at the `/docs` path is up to date and includes the new routes:

![API Documentation](images/examples/03/api_4.png)

![Roles Documentation](images/examples/03/api_5.png)

There! This gives us a platform to build our new API upon. We'll continue throughout this example project to add additional routes to the API as well as related unit tests. 