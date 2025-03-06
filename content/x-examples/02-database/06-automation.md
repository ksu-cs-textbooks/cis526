---
title: "Automation"
pre: "6. "
weight: 60
---

{{< youtube LMQZ6OXpzGU >}}

## Automating Database Deployment

One very helpful feature we can add to our application is the ability to automatically migrate and seed the database when the application first starts. This can be especially helpful when deploying this application in a container. 

To do this, let's add some additional code to our `bin/www` file that is executed when our project starts:

```js {title="bin/www" hl_lines="13 15-16 29-58"}
/**
 * @file Executable entrypoint for the web application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import libraries
import http from 'http';

// Import Express application
import app from '../app.js';

// Import configurations
import database from '../configs/database.js';
import logger from '../configs/logger.js';
import migrations from '../configs/migrations.js';
import seeds from '../configs/seeds.js';

// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server.
var server = http.createServer(app);

// Attach event handlers
server.on('error', onError);
server.on('listening', onListening);

// Call startup function
startup();

/**
 * Server startup function
 */
function startup() {
  try {
    // Test database connection
    database.authenticate().then(() => {
      logger.debug("Database connection successful")
      // Run migrations
      migrations.up().then(() => {
        logger.debug("Database migrations complete")
        if (process.env.SEED_DATA === 'true') {
          logger.warn("Database data seeding is enabled!")
          seeds.up().then(() => {
            logger.debug("Database seeding complete")
            server.listen(port)
          })
        } else {
          // Listen on provided port, on all network interfaces.
          server.listen(port)
        }
      })
    })
  } catch (error){
    logger.error(error)
  }
}

// -=-=- other code omitted here -=-=-
```

We now have a new `startup` function that will first test the database connection, then run the migrations, and finally it will seed the database if the `SEED_DATA` environment variable is set to `true`. Once all that is done, it will start the application by calling `server.listen` using the port. 

Notice that this code uses the `then()` function to resolve promises instead of the `async` and `await` keywords. This is because it is running at the top level, and cannot include any `await` keywords. 

To enable this, let's add the `SEED_DATA` environment variable to both `.env` and `.env.example`:

```env {title=".env" hl_lines="6"}
LOG_LEVEL=debug
PORT=3000
OPENAPI_HOST=https://$CODESPACE_NAME-$PORT.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
OPENAPI_VISIBLE=true
DATABASE_FILE=database.sqlite
SEED_DATA=true
```

```env {title=".env.example" hl_lines="8"}
LOG_LEVEL=debug
PORT=3000
OPENAPI_HOST=http://localhost:3000
# For GitHub Codespaces
# OPENAPI_HOST=https://$CODESPACE_NAME-$PORT.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
OPENAPI_VISIBLE=false
DATABASE_FILE=database.sqlite
SEED_DATA=false
```

To test this, we can delete the `database.sqlite` file in our repository, then start our project:

```bash {title="terminal"}
$ npm run dev
```

If it works correctly, we should see that our application is able to connect to the database, migrate the schema, and add the seed data, before fully starting:

``` {title="output" hl_lines="11-23"}
> example-project@0.0.1 dev
> nodemon ./bin/www

[nodemon] 3.1.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./bin/www`
[dotenvx@1.34.0] injecting env (6) from .env
[2025-02-04 06:56:11.823 PM] warn:      OpenAPI documentation visible!
[2025-02-04 06:56:12.163 PM] debug:     Database connection successful
[2025-02-04 06:56:12.208 PM] info:      { event: 'migrating', name: '00_users.js' }
[2025-02-04 06:56:12.265 PM] info:      { event: 'migrated', name: '00_users.js', durationSeconds: 0.058 }
[2025-02-04 06:56:12.266 PM] debug:     Database migrations complete
[2025-02-04 06:56:12.266 PM] warn:      Database data seeding is enabled!
[2025-02-04 06:56:12.296 PM] info:      { event: 'migrating', name: '00_users.js' }
[2025-02-04 06:56:12.321 PM] info:      { event: 'migrated', name: '00_users.js', durationSeconds: 0.024 }
[2025-02-04 06:56:12.321 PM] debug:     Database seeding complete
[2025-02-04 06:56:12.323 PM] info:      Listening on port 3000
```

There we go! Our application will now always make sure the database is properly migrated, and optionally seeded, before it starts. Now, when another developer or user starts our application, it will be sure to have a working database. 

This is a good point to **commit and push** our work!