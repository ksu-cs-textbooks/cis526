---
title: "Migrations"
pre: "2. "
weight: 20
---

{{< youtube id >}}

## Umzug 

Now that we have a database configured in our application, we need to create some way to actually populate that database with the tables and information our app requires. We could obviously do that manually, but that really makes it difficult (if not impossible) to automatically build, test, and deploy this application.

Thankfully, most database libraries also have a way to automate building the database structure. This is known as [schema migration](https://en.wikipedia.org/wiki/Schema_migration) or often just **migration**. We call it migration because it allows us to update the database schema along with new versions of the application, effectively _migrating_ our data to new versions as we go.

The `sequelize` library recommends using another library, named [Umzug](https://github.com/sequelize/umzug), as the preferred way to manage database migrations. It is actually completely framework agnostic, and would even work with ORMs other than Sequelize. 

## Setting up Umzug

To begin, let's install `umzug` using `npm`:

```bash {title="terminal"}
$ npm install umzug
```

Next, we can create a configuration file to handle our migrations, named `configs/migrations.js`, with the following content as described in the [Umzug Documentation](https://github.com/sequelize/umzug):

```js {title="configs/migrations.js"}
/**
 * @file Configuration information for Umzug migration engine
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
    migrations: {glob: 'migrations/*.js'},
    context: database.getQueryInterface(),
    storage: new SequelizeStorage({
        sequelize: database,
        modelName: 'migrations'
    }),
    logger: logger
})

export default umzug;
```

Notice that this configuration uses our existing `sequelize` database configuration, and also uses an instance of our `logger` as well. It is set to look for any migrations stored in the `migrations/` folder. 

The `umzug` library also has a very handy way to run migrations directly from the terminal using a simple JavaScript file, so let's create a new file named `migrate.js` in the root of the `server` directory as well with this content:

```js {title="migrate.js"}
// Load environment (must be first)
import "@dotenvx/dotenvx/config";

// Import configurations
import migrations from './configs/migrations.js'

// Run Umzug as CLI application
migrations.runAsCLI();
```

This file will simply load our environment configuration as well as the `umzug` instance for migrations, and then instruct it to run as a command-line interface (CLI) application. This is very handy, as we'll see shortly.

## Creating a Migration

