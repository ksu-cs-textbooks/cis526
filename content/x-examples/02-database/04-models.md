---
title: "Models"
pre: "4. "
weight: 40
---

{{< youtube id >}}

## Database Models

Now that we have our database table structure and sample data set up, we can finally configure `sequelize` to query our database by defining a [model](https://sequelize.org/docs/v6/core-concepts/model-basics/) representing that data. At its core, a model sis simply an abstraction that represents the structure of the data in a table of our database. We can equate this to a `class` in object-oriented programming - each row or _record_ in our database can be thought of as an _instance_ of our model class. You can learn more about models in the [Sequelize Documentation](https://sequelize.org/docs/v6/core-concepts/model-basics/)

To create a model, let's first create a `models` folder in our app, then we can create a file `user.js` that contains the schema for the `User` model, based on the `users` table.

{{% notice note "Singular vs. Plural" %}}

By convention, model names are usually singular like "user" while table names are typically pluralized like "users." This is not a rule that must be followed, but many web frameworks use this convention so we'll also follow it.

{{% /notice %}}

The `User` model schema should look very similar to the table definition used in the migration created earlier in this example:

```js {title="models/user.js"}
/**
 * @file User schema
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports UserSchema the schema for the User model
 */

// Import libraries
import Sequelize from 'sequelize';

const UserSchema = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
}

export default UserSchema
```

At a minimum, a model schema defines the attributes that are stored in the database, but there are many more features that can be added over time, such as additional computed fields (for example, a `fullName` field that concatenates the `giveName` and `familyName` fields stored in the database). We'll explore ways to improve our models in later examples.

Once we have the model schema created, we'll create a second file named `models.js` that will pull together all of our schemas and actually build the `sequelize` models that can be used throughout our application.

```js {title="models/models.js"}
/**
 * @file Database models
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports User a Sequelize User model
 */

// Import database connection
import database from "../configs/database.js";

// Import Schemas
import UserSchema from './user.js';

// Create User Model
const User = database.define(
    // Model Name
    'User',
    // Schema
    UserSchema,
    // Other options
    {
        tableName: 'users'
    }
)

export {
    User
}
```

It is also important to note that we can define the name of the table that stores instances of the model in the `tableName` option. 

We will see why it is important to use this `models.js` file (instead of just defining the model itself and not just the schema in the `users.js` file) once we start adding relations between the models. For now, we'll start with this simple scaffold that we can expand upon in the future.

{{% notice note "Models vs. Migrations" %}}

One of the more interesting features of `sequelize` is that it can use just the models themselves to define the structure of the tables in the database. It has features such as [Model Synchronization](https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization) to keep the database structure updated to match the given models. 

However, even in the documentation, `sequelize` recommends using migrations for more complex database structures. So, in our application, the migrations will represent the incremental steps required over time to construct our application's database tables, whereas the models will represent the full structure of the database tables at this point in time. As we add new features to our application, this difference will become more apparent. 

{{% /notice %}}

## Model Querying

Finally, we are at the point where we can actually use our database in our application! So, let's update the route for the `users` endpoint to actually return a list of the users of our application in a JSON format:

```js {title="routes/users.js" hl_lines="18-19 39-40"}
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
import { User } from '../models/models.js'

/**
 * Gets the list of users
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @swagger
 * /users:
 *   get: 
 *     summary: users list page
 *     description: Gets the list of all users in the application
 *     tags: [users]
 *     responses:
 *       200: 
 *         description: a resource         
 */
router.get("/", async function (req, res, next) {
  const users = await User.findAll();
  res.json(users)
});

export default router;
```

The only change we need to make is to import our `User` model we just created in the `models/models.js` file, and then use the `User.findAll()` query method inside of our first route method. A full list of all the querying functions in `sequelize` can be found in the [Sequelize Documentation](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/)

Now, let's start our application and see if it works! We should make sure we have migrated and seeded the database recently before starting. If everything works correctly, we should be able to navigate to the `/users` path and see the following JSON output on the page:

```json {title="route: /users"}
[
  {
    "id": 1,
    "username": "admin",
    "createdAt": "2025-02-04T15:36:32.000Z",
    "updatedAt": "2025-02-04T15:36:32.000Z"
  },
  {
    "id": 2,
    "username": "contributor",
    "createdAt": "2025-02-04T15:36:32.000Z",
    "updatedAt": "2025-02-04T15:36:32.000Z"
  },
  {
    "id": 3,
    "username": "manager",
    "createdAt": "2025-02-04T15:36:32.000Z",
    "updatedAt": "2025-02-04T15:36:32.000Z"
  },
  {
    "id": 4,
    "username": "user",
    "createdAt": "2025-02-04T15:36:32.000Z",
    "updatedAt": "2025-02-04T15:36:32.000Z"
  }
]
```

Awesome! We have now developed a basic web application that is able to query a database and present data to the user in a JSON format. This is the first big step toward actually building a RESTful API application. 

This is a good point to **commit and push** our work!

{{% notice warning "Committing Database Files" %}}

One thing we might notice is that our `database.sqlite` file is in the list of files to be committed to our GitHub repository for this project. In many cases, you may or may not want to do this, depending on what type of data you are storing in the database and how you are using it.

For this application, and the projects in this course, we'll go ahead and commit our database to GitHub since that is the simplest way to share that information.

{{% /notice %}}