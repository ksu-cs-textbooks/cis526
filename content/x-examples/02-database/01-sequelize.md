---
title: "Sequelize"
pre: "1. "
weight: 10
---

{{< youtube RN46EzaMHy0 >}}

## Database Libraries

To begin, we must first select a library to use when interfacing with our database. There are many different types of libraries, and many different options to choose from.

1) First and foremost, we can always just write raw SQL queries directly in our code. This is often very straightforward, but also can lead to very complex code and security issues. It also doesn't offer many of the more advanced features such as mapping database results to object types and automatically managing database schemas.

2) Another option is an SQL query library, such as [Knex.js](https://knexjs.org/) or [Kysely](https://kysely.dev/). These libraries provide a helpful abstraction on top of SQL, allowing developers to build queries using syntax that is more comfortable and familiar to them. These libraries also have additional features to manage database schemas and sample data

3) The final option is an [Object-Relational Mapping (ORM)](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) library such as [Objection](https://vincit.github.io/objection.js/) or [Sequelize](https://sequelize.org/). These libraries provide the most abstraction away from raw SQL, often allowing developers to store and retrieve data in a database as if it were stored in a list or dictionary data structure. 

For this project, we're going to use the [Sequelize](https://sequelize.org/) ORM, coupled with the [Umzug](https://github.com/sequelize/umzug) migration tool. Both of these libraries are very commonly used in Node.js projects, and are actively maintained. 

{{% notice note "Database Engines" %}}

We also have many choices for the database engine we want to use for our web projects. Some common options include [PostgreSQL](https://www.postgresql.org/), [MySQL](https://www.mysql.com/), [MariaDB](https://mariadb.org/), [MongoDB](https://www.mongodb.com/), [Firebase](https://firebase.google.com/), and many more. 

For this project, we're going to use [SQLite](https://www.sqlite.org/). SQLite is unique because it is a database engine that only requires a single file, so it is self-contained and easy to work with. It doesn't require any external database servers or software, making it perfect for a small development project. In fact, SQLite may be one of the most [widely deployed software modules](https://www.sqlite.org/mostdeployed.html) in the whole world!

Naturally, if wer plan on growing a web application beyond a simple hobby project with a few users, we should spend some time researching a reliable database solution. Thankfully, the Sequelize ORM supports [many different database engines](https://sequelize.org/docs/v6/other-topics/dialect-specific-things/) so it is easy to switch.

{{% /notice %}}

## Installing Sequelize

To begin, let's install both `sequelize` as well as the `sqlite3` library using `npm`:

```bash {title="terminal"}
$ npm install sqlite3 sequelize
```

Once those libraries are installed, we can now configure `sequelize` following the information in the [Sequelize Documentation](https://sequelize.org/docs/v6/getting-started/). Let's create a new file `configs/database.js` to store our database configuration:

```js {title="configs/database.js"}
/**
 * @file Configuration information for Sequelize database ORM
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports sequelize a Sequelize instance
 */

// Import libraries
import Sequelize from 'sequelize';

// Import logger configuration
import logger from "./logger.js";

// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DATABASE_FILE || ":memory:",
    logging: logger.sql.bind(logger)
})

export default sequelize;
```

This file creates a very simple configuration for `sequelize` that uses the `sqlite` dialect. It uses the `DATABASE_FILE` environment variable to control the location of the database in the file system, and it also uses the `logger.sql` log level to log any data produced by the library. If a `DATABASE_FILE` environment variable is not provided, it will default to storing data in the SQLite [In-Memory Database](https://www.sqlite.org/inmemorydb.html), which is great for testing and quick development.

Of course, a couple of those items don't actually exist yet, so let's add those in before we move on! First, we need to add a `DATABASE_FILE` environment variable to both our `.env` and `.env.example` files:

```env {title=".env" hl_lines="5"}
LOG_LEVEL=debug
PORT=3000
OPENAPI_HOST=https://$CODESPACE_NAME-$PORT.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
OPENAPI_VISIBLE=true
DATABASE_FILE=database.sqlite
```

```env {title=".env.example" hl_lines="7"}
LOG_LEVEL=debug
PORT=3000
OPENAPI_HOST=http://localhost:3000
# For GitHub Codespaces
# OPENAPI_HOST=https://$CODESPACE_NAME-$PORT.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
OPENAPI_VISIBLE=false
DATABASE_FILE=database.sqlite
```

We also need to add a new logging level called `sql` to our logger configuration in `configs/logger.js`. This is a bit more involved, because it means we have to now list all intended logging levels explicitly. See the highlighted lines below for what has been changed, but the entire file is included for convenience:

```js {title="configs/logger.js" hl_lines="38-43 48-72 78"}
/**
 * @file Configuration information for Winston logger
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports logger a Winston logger object
 */

// Import libraries
import winston from "winston";

// Extract format options
const { combine, timestamp, printf, colorize, align, errors } = winston.format;

/**
 * Determines the correct logging level based on the Node environment
 *
 * @returns {string} the desired log level
 */
function level () {
  if (process.env.LOG_LEVEL) {
    if (process.env.LOG_LEVEL === '0' || process.env.LOG_LEVEL === 'error') {
      return 'error';
    }
    if (process.env.LOG_LEVEL === '1' || process.env.LOG_LEVEL === 'warn') {
      return 'warn';
    }
    if (process.env.LOG_LEVEL === '2' || process.env.LOG_LEVEL === 'info') {
      return 'info';
    }
    if (process.env.LOG_LEVEL === '3' || process.env.LOG_LEVEL === 'http') {
      return 'http';
    }
    if (process.env.LOG_LEVEL === '4' || process.env.LOG_LEVEL === 'verbose') {
      return 'verbose';
    }
    if (process.env.LOG_LEVEL === '5' || process.env.LOG_LEVEL === 'debug') {
      return 'debug';
    }
    if (process.env.LOG_LEVEL === '6' || process.env.LOG_LEVEL === 'sql') {
      return 'sql';
    }
    if (process.env.LOG_LEVEL === '7' || process.env.LOG_LEVEL === 'silly') {
      return 'silly';
    }
  }
  return 'http';
}

// Custom logging levels for the application
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  sql: 6,
  silly: 7
}

// Custom colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'green',
  verbose: 'cyan',
  debug: 'blue',
  sql: 'gray',
  silly: 'magenta'
}

winston.addColors(colors)

// Creates the Winston instance with the desired configuration
const logger = winston.createLogger({
  // call `level` function to get default log level
  level: level(),
  levels: levels,
  // Format configuration
  // See https://github.com/winstonjs/logform
  format: combine(
    colorize({ all: true }),
    errors({ stack: true }),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(),
    printf(
      (info) =>
        `[${info.timestamp}] ${info.level}: ${info.stack ? info.message + "\n" + info.stack : info.message}`,
    ),
  ),
  // Output configuration
  transports: [new winston.transports.Console()],
});

export default logger;
```

We have added a new `sql` logging level that is now part of our logging setup. One of the unique features of `sequelize` is that it will actually allow us to log all SQL queries run against our database, so we can enable and disable that level of logging by adjusting the `LOG_LEVEL` environment variable as desired.

There! We now have a working database configuration. Before we can make use of it, however, we need to add additional code to create and populate our database. So, we'll need to continue on in this tutorial before we can actually test our application.