---
title: "Seeds"
pre: "3. "
weight: 30
---

{{< youtube id >}}

## Database Seeding

Another useful task that `umzug` can handle is adding some initial data to a new database. This process is known as _seeding_ the database. Thankfully, the process for seeding is nearly identical to the process for migrations - in fact, it uses the same operations in different ways! So, let's explore how to set that up.

First, we'll create a new configuration file at `configs/seeds.js` that contains nearly the same content as `configs/migrations.js` with a couple of important changes on the highlighted lines:

```js {title="configs/seeds.js" hl_lines="16 20"}
/**
 * @file Configuration information for Umzug seed engine
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports umzug an Umzug instance
 */

// Import Libraries
import { Umzug, SequelizeStorage } from 'umzug';

// Import database configuration
import database from "./database.js";
import logger from "./logger.js";

// Create Umzug instance
const umzug = new Umzug({
    migrations: {glob: 'seeds/*.js'},
    context: database.getQueryInterface(),
    storage: new SequelizeStorage({
        sequelize: database,
        modelName: 'seeds'
    }),
    logger: logger
})

export default umzug;
```

All we really have to do is change the folder where the migrations (in this case, the seeds) are stored, and we also change the name of the model, or table, where that information will be kept in the database.

Next, we'll create a `seed.js` file that allows us to run the seeds from the command line. Again, this file is nearly identical to the `migrate.js` file from earlier, with a couple of simple changes:

```js {title="seed.js" hl_lines="5 8"}
// Load environment (must be first)
import "@dotenvx/dotenvx/config";

// Import configurations
import seeds from './configs/seeds.js'

// Run Umzug as CLI application
seeds.runAsCLI();
```

Finally, we can create a new folder `seeds` to store our seeds, and then create the first seed also called `00_users.js` to add a few default users to our database:

```js {title="seeds/00_users.js"}
/**
 * @file Users seed
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports up the Up migration
 * @exports down the Down migration
 */

// Timestamp in the appropriate format for the database
const now = new Date().toISOString().slice(0, 23).replace("T", " ") + " +00:00";

// Array of objects to add to the database
const users = [
    {
        id: 1,
        username: 'admin',
        createdAt: now,
        updatedAt: now
    },
    {
        id: 2,
        username: 'contributor',
        createdAt: now,
        updatedAt: now
    },
    {
        id: 3,
        username: 'manager',
        createdAt: now,
        updatedAt: now
    },
    {
        id: 4,
        username: 'user',
        createdAt: now,
        updatedAt: now
    },
];

/**
 * Apply the seed
 * 
 * @param {queryInterface} context the database context to use 
 */
export async function up({context: queryInterface}) {
    await queryInterface.bulkInsert('users', users);
}

/**
 * Roll back the seed
 * 
 * @param {queryInterface} context the database context to use 
 */
export async function down({context: queryInterface}) {
    await queryInterface.bulkDelete('users', { id: users.map(u => u.id) });
}
```

This seed will add 4 users to the database. Notice that we are setting both the `createdAt` and `updatedAt` fields manually - while the `sequelize` library will manage those for us in certain situations, we must handle them manually when doing a bulk insert directly to the database.

At this point we can insert our seeds into the database using the command line interface:

```bash {title="terminal"}
$ node seed up
```

``` {title="output"}
[dotenvx@1.34.0] injecting env (5) from .env
[2025-02-04 02:47:20.702 PM] info:      { event: 'migrating', name: '00_users.js' }
[2025-02-04 02:47:20.716 PM] info:      { event: 'migrated', name: '00_users.js', durationSeconds: 0.013 }
[2025-02-04 02:47:20.716 PM] info:      applied 1 migrations.
```

Now, once we've done that, we can go back to the [SQLite Viewer](https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer) extension in VS Code to confirm that our data was properly inserted into the database.

![Seeded Data](images/examples/02/seed_1.png)

{{% notice info "Migrate Before Seeding" %}}

One common mistake that is very easy to do is to try and seed the database without first migrating it. 

``` {title="output"}
[2025-02-04 02:51:39.452 PM] info:      { event: 'migrating', name: '00_users.js' }

Error: Migration 00_users.js (up) failed: Original error: SQLITE_ERROR: no such table: users
```

Thankfully `umzug` gives a pretty helpful error in this case.

Another common error is to forget to roll back seeds before rolling back and resetting any migrations. In that case, when you try to apply your seeds again, they will not be applied since the database thinks the data is still present. So, remember to roll back your seeds _before_ rolling back any migrations!

{{% /notice %}}

We're almost ready to test our app! The last step is to create a model for our data, which we'll cover on the next page.