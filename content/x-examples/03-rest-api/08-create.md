---
title: "Create"
pre: "8. "
weight: 80
---

{{< youtube id >}}

## Create Route

Now that we've explored the routes we can use to read data from our RESTful API, let's look at the routes we can use to modify that data. The first one we'll cover is the **create** route, which allows us to add a new entry to the database. However, before we do that, let's create some helpful utility functions that we can reuse throughout our application as we develop more advanced routes.

### Success Messages

One thing we'll want to be able to do is send some well-formatted success messages to the user. While we could include this in each route, it is a good idea to abstract this into a utility function that we can write once and use throughout our application. By doing so, it makes it easier to restructure these messages as needed in the future.

So, let's create a new `utilities` folder inside of our `server` folder, and then a new `send-success.js` file with the following content:

```js {title="utilities/send-success.js"}
/**
 * @file Sends JSON Success Messages
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports sendSuccess a function to send JSON Success Messages
 */

/**
 * Send JSON Success Messages
 *
 * @param {string} message - the message to send
 * @param {integer} status - the HTTP status to use
 * @param {Object} res - Express response object
 *
 * @swagger
 * components:
 *   responses:
 *     Success:
 *       description: success
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: the description of the successful operation
 *             example:
 *               message: User successfully saved!
 */
function sendSuccess(message, status, res) {
  res.status(status).json({
    message: message,
  });
}
  
export default sendSuccess;
```

In this file, we are defining a **success** message from our application as a JSON object with a single `message` attribute. The code itself is very straightforward, but we are including the appropriate Open API documentation as well, which we can reuse in our routes elsewhere.

To make the Open API library aware of these new files, we need to add it to our `configs/openapi.js` file:

```js {title="configs/openapi.js" hl_lines="17"}
// -=-=- other code omitted here -=-=-

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
  apis: ["./routes/*.js", "./models/*.js", "./routes/api/v1/*.js", "./utilities/*.js"],
};
```

### Validation Error Messages

Likewise, we may also want to send a well-structured message anytime our database throws an error, or if any of our model validation steps fails. So, we can create another file `handle-validation-error.js` with the following content:

```js {title="utilities/handle-validation-error.js"}
/**
 * @file Error handler for Sequelize Validation Errors
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports handleValidationError a handler for Sequelize validation errors
 */

/**
 * Gracefully handle Sequelize Validation Errors
 * 
 * @param {SequelizeValidationError} error - Sequelize Validation Error
 * @param {Object} res - Express response object
 * 
 * @swagger
 * components:
 *   responses:
 *     Success:
 *     ValidationError: 
 *       description: model validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - error
 *             properties:
 *               error: 
 *                 type: string
 *                 description: the description of the error
 *               errors:
 *                 type: array
 *                 items:
 *                    type: object
 *                    required: 
 *                      - attribute
 *                      - message
 *                    properties:
 *                      attribute:
 *                        type: string
 *                        description: the attribute that caused the error
 *                      message:
 *                        type: string
 *                        description: the error associated with that attribute
 *             example:
 *               error: Validation Error
 *               errors:
 *                 - attribute: username
 *                   message: username must be unique
 */
function handleValidationError(error, res) {
  if (error.errors.length > 0) {
    const errors = error.errors
    .map((e) => {
      return {attribute: e.path, message: e.message}
    })
    res.status(422).json({ 
      error: "Validation Error",
      errors: errors
    });
  } else {
    res.status(422).json({
      error: error.parent.message
    })
  }
}

export default handleValidationError;
```

Again, the code for this is not too complex. It builds upon the structure in the [Sequelize ValidationError](https://sequelize.org/api/v7/classes/_sequelize_core.index.validationerror) class to create a helpful JSON object that includes both an `error` attribute as well as an optional `errors` array that lists each attribute with a validation error, if possible. We also include the appropriate Open API documentation for this response type. 

{{% notice note "Trial & Error" %}}

If we look at the code in the `handle-validation-error.js` file, it may seem like it came from nowhere, or it may be difficult to see how this was constructed based on what little is given in the Sequelize documentation.

In fact, this code was actually constructed using a trial and error process by iteratively submitting broken models and looking at the raw errors that were produced by Sequelize until a common structure was found. For the purposes of this example, we're leaving out some of these steps, but we encourage exploring the output to determine the best method for any given application.

{{% /notice %}}

## Creating a New User

Now that we have created helpers for our route, we can add the code to actually create that new user when an HTTP POST request is receive4d.

In our `routes/api/v1/users.js` file, let's add a new route we can use to create a new entry in the `users` table:

```js {title="routes/api/v1/users.js" hl_lines="5 16-17 19-21"}
// -=-=- other code omitted here -=-=-

// Import libraries
import express from "express";
import { ValidationError } from "sequelize";

// Create Express router
const router = express.Router();

// Import models
import { User, Role } from "../../../models/models.js";

// Import logger
import logger from "../../../configs/logger.js";

// Import database
import database from "../../../configs/database.js"

// Import utilities
import handleValidationError from "../../../utilities/handle-validation-error.js";
import sendSuccess from "../../../utilities/send-success.js";

// -=-=- other code omitted here -=-=-

/**
 * Create a new user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: create user
 *     tags: [users]
 *     requestBody:
 *       description: user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             username: newuser
 *             roles:
 *               - id: 6
 *               - id: 7
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       422:
 *         $ref: '#/components/responses/ValidationError'         
 */
router.post("/", async function (req, res, next) {
  try {
    // Use a database transaction to roll back if any errors are thrown
    await database.transaction(async t => {
      const user = await User.create(
        // Build the user object using body attributes
        {
          username: req.body.username,
        },
        // Assign to a database transaction
        {
          transaction: t
        }
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
      }
  
      // Send the success message
      sendSuccess("User saved!", 201, res);
    })
    
  } catch (error) {
    if (error instanceof ValidationError) {
      handleValidationError(error, res);
    } else {
      logger.error(error);
      res.status(500).end();
    }
  }
});
```

At the top of the file, we have added several additional import statements:
* `ValidationError` - we import the `ValidationError` type from the Sequelize library
* `database` - we import our Sequelize instance from `configs/database.js` so we can create a transaction
* `handleValidationError` and `sendSuccess` - we import our two new utilities from the `utilities` folder

This route itself is quite a bit more complex that our previous routes, so let's break down what it does piece by piece to see how it all works together.

1. Start a database transaction

```js {title="routes/api/v1/users.js"}
// -=-=- other code omitted here -=-=-
    await database.transaction(async t => {

      // perform database operations here

    });
// -=-=- other code omitted here -=-=-
```

First, since we will be updating the database using multiple steps, we should use a [database transaction](https://en.wikipedia.org/wiki/Database_transaction) to ensure that we only update the database if all operations will succeed. So, we use the [Sequelize Transactions](https://sequelize.org/docs/v6/other-topics/transactions/) feature to create a new managed database transaction. If we successfully reach the end of the block of code contained in this statement, the database transaction will be _committed_ to the database and the changes will be stored.

2. Create the `User` itself

```js {title="routes/api/v1/users.js"}
// -=-=- other code omitted here -=-=-
      const user = await User.create(
        // Build the user object using body attributes
        {
          username: req.body.username,
        },
        // Assign to a database transaction
        {
          transaction: t
        }
      );
// -=-=- other code omitted here -=-=-
```

Next, we use the `User` model to create a new instance of the user and store it in the database. The [Sequelize Create](https://sequelize.org/docs/v6/core-concepts/model-instances/#a-very-useful-shortcut-the-create-method) method will both build the new object in memory as well as save it to the database. This is an asynchronous process, so we must `await` the result before moving on. We also must give this method a reference to the current database transaction `t` in the second parameter.

3. Associate Roles

```js {title="routes/api/v1/users.js"}
// -=-=- other code omitted here -=-=-
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
      }
// -=-=- other code omitted here -=-=-
```

After that, we check to see if the `roles` attribute was provided as part of the body of the HTTP POST method. If it was, we need to associate those roles with the new user. Here, we are assuming that the submission includes the ID for each role at a minimum, but it may also include other data such as the name of the role. So, before doing anything else, we must first find each `Role` model in the database by ID using the `findByPk` method. Once we have a list of roles, then we can add those roles to the `User` object using the special `setRoles` method that is created as part of the `Roles` association on that model. If any roles are null and can't be found, this will throw an error that we can catch later.

4. Send Success Messages

```js {title="routes/api/v1/users.js"}
      // Send the success message
      sendSuccess("User saved!", 201, res);
```

Finally, if everything is correct, we can send the success message back to the user using the `sendSuccess` utility method that we created earlier. 

5. Handle Exceptions

```js {title="routes/api/v1/users.js"}
// -=-=- other code omitted here -=-=-
  } catch (error) {
    if (error instanceof ValidationError) {
      handleValidationError(error, res);
    } else {
      logger.error(error);
      res.status(500).end();
    }
  }
// -=-=- other code omitted here -=-=-
```

Finally, at the bottom of the file we have a `catch` block that will catch any exceptions thrown while trying to create our `User` and associate the correct `Role` objects. Notice that this `catch` block is **outside** the database transaction, so any database changes will not be saved if we reach this block of code.

Inside, we check to see if the error is an instance of the `ValidationError` class from Sequelize. If so, we can use our new `handleValidationError` method to process that error and send a well-structured JSON response back to the user about the error. If not, we'll simply log the error and send back a generic HTTP 500 response code. 
