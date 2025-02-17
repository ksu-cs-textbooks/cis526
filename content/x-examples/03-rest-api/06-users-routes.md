---
title: "Users Routes"
pre: "6. "
weight: 60
---

{{< youtube id >}}

## Users Routes

Now that we have written and tested the routes for the `Role` model, let's start working on the routes for the `User` model. These routes will be much more complex, because we want the ability to add, update, and delete users in our database. 

To do this, we'll create several RESTful routes, which pair HTTP verbs and paths to the various CRUD operations that can be performed on the database. Here is a general list of the actions we want to perform on most models in a RESTful API, based on their associated CRUD operation:

* Create New (HTTP POST)
* Retrieve All / Retrieve One (HTTP GET)
* Update One (HTTP PUT)
* Delete One (HTTP DELETE)

As we build this new API router, we'll see each one of these in action.

### Retrieve All

The first operation we'll look at is the **retrieve all** operation, which is one we're already very familiar with. To begin, we should start by copying the existing file at `routes/users.js` to `routes/api/v1/users.js` and modifying it a bit to contain this content:

```js {title="routes/api/v1/users.js" hl_lines="24-25 35 51 63-66" }
/**
 * @file Users router
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports router an Express router
 *
 * @swagger
 * tags:
 *   name: users
 *   description: Users Routes
 */

// Import libraries
import express from "express";

// Create Express router
const router = express.Router();

// Import models
import {
  User,
  Role,
} from "../../../models/models.js";

// Import logger
import logger from "../../../configs/logger.js";

/**
 * Gets the list of users
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: users list page
 *     description: Gets the list of all users in the application
 *     tags: [users]
 *     responses:
 *       200:
 *         description: the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll({
      include: {
        model: Role,
        as: "roles",
        attributes: ["id", "role"],
        through: {
          attributes: [],
        },
      },
    });
    res.json(users);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

export default router;

```