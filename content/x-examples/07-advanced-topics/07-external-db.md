---
title: "External Database"
pre: "7. "
weight: 70
---

{{< youtube id >}}

## Connecting to an External Database

Finally, what if we'd like to update our application to connect to an external database? This could be very useful if we plan on using this application in production with a large amount of data, because an external database will be much faster and handle large amounts of data much better than our SQLite database stored in a single file.

For this example, we'll update our application to be able to use [Postgres](https://www.postgresql.org/). Most of this process can be discovered by reading the [Sequelize Documentation](https://sequelize.org/docs/v6/getting-started/) to see how to connect other database types to our application.

## Update Database Configuration

First, we need to update the database configuration for our application, which is in the `configs/database.js` file in our `server` folder. We'll add several additional options to allow us to specify the dialect, hostname, username, and password for another database engine.

```js {title="configs/database.js"}
/**
 * @file Configuration information for Sequelize database ORM
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports sequelize a Sequelize instance
 */

// Import libraries
import Sequelize from "sequelize";

// Import logger configuration
import logger from "./logger.js";

// Create Sequelize instance
const sequelize = new Sequelize({
  // Supports "sqlite" or "postgres"
  dialect: process.env.DATABASE_DIALECT || "sqlite",
  // Only used by SQLite
  storage: process.env.DATABASE_FILE || ":memory:",
  // Used by Postgres
  host: process.env.DATABASE_HOST || "lostcommunities_db",
  port: process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USERNAME || "lostcommunities",
  password: process.env.DATABASE_PASSWORD || "lostcommunities",
  database: process.env.DATABASE_NAME || "lostcommunities",
  logging: logger.sql.bind(logger),
});

export default sequelize;
```

We'll also need to install the appropriate database libraries in our `server` application:

```bash {title="terminal"}
$ npm install pg pg-hstore
```

We should also add these new environment variable entries to our `.env.example` file, including relocating the existing `DATABASE_FILE` entry to this section with the others. Since we aren't using them in development or testing, we can leave them out of the other files for now.

```env {title=".env.example"}
# -=-=- other settings omitted here -=-=-
# Database Settings
# Options are "sqlite" or "postgres"
DATABASE_DIALECT=sqlite
# File is specified for SQLite
DATABASE_FILE=database.sqlite
# Other settings are for Postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=lostcommunities
DATABASE_PASSWORD=lostcommunities
DATABASE_NAME=lostcommunities
```

To test this, we'll need a running Postgres instance. While we can create one in our GitHub Codespaces by adding some additional configuration files, it is a bit more complex. So, let's just update our `compose.yml` file for deployment and test using another database there. 

```yml {title="compose.yml"}
services:
  
  ######################################
  # Lost Communities Solution
  #
  # Repository:
  # https://github.com/cis526-codio/lost-communities-solution
  lostcommunities:
    
    # Docker Image
    image: ghcr.io/cis526-codio/lost-communities-solution:latest

    # Container Name
    container_name: lostcommunities

    # Restart Container Unless Stopped
    restart: unless-stopped

    # Networks
    networks:
      - default
      - lostcommunities_network

    # Network Ports
    ports:
      - "3000:3000"

    # Volumes
    volumes:
      - lostcommunities_data:/usr/src/app/data:rw
      - lostcommunities_uploads:/usr/src/app/public/uploads:rw

    # Environment Variables
    environment:
      # =+=+=+= REQUIRED VALUES =+=+=+=
      # These values must be configured for deployment

      # Session Secret Key
      SESSION_SECRET: 'thisisasupersecretkey'
      # JWT Secret Key
      JWT_SECRET_KEY: 'thisisasupersecretkey'
      # Use Node and run `require('crypto').randomBytes(64).toString('hex')` to get a random value

      # CAS Authentication Settings
      # CAS Server URL (send users here to login)
      CAS_URL: 'https://testcas.cs.ksu.edu'
      # CAS Service URL (CAS returns users here; usually where this app is deployed)
      CAS_SERVICE_URL: 'http://localhost:3000'

      # Database Options
      # Database Dialect
      # Options: 'sqlite' (default) or 'postgres'
      DATABASE_DIALECT: 'postgres'

      # For SQLite Only - Specify file location
      # Options: ':memory:' to use an in-memory database (not recommended), or any file name otherwise
      # DATABASE_FILE: 'data/database.sqlite'

      # For Postgres Only - Specify database information
      DATABASE_HOST: lostcommunities_db
      DATABASE_PORT: 5432
      DATABASE_USERNAME: lostcommunities
      DATABASE_PASSWORD: lostcommunities
      DATABASE_NAME: lostcommunities

      # Seed initial data on first startup
      SEED_DATA: 'true'

      # =+=+=+= OPTIONAL VALUES =+=+=+=
      # These values are set to reasonable defaults
      # but can be overridden. Default values are shown as comments

      # Log Level
      # Options: error | warn | info | http | verbose | debug | sql | silly
      #LOG_LEVEL: 'http'

      # Network Port Within the Container
      #PORT: '3000'

      # =+=+=+= OTHER VALUES =+=+=+=
      # These values are not recommended for deployment but are available

      # Custom Session Cookie Name
      #SESSION_NAME: 'connect.sid'

      # Open API Documentation
      # Show OpenAPI Documentation at `/docs` path
      #OPENAPI_VISIBLE: 'false'

      # Open API Host for testing
      #OPENAPI_HOST: 'http://localhost:3000'

      # Export Open API JSON File
      #OPENAPI_EXPORT: 'false

      # Open API Export File Path
      #OPENAPI_EXPORT_PATH: 'openapi.json'

      # Enable Bypass Authentication
      # Use path `/auth/bypass?token=<username>` to log in as any user
      # DO NOT ENABLE IN PRODUCTION - THIS IS INSECURE!
      #BYPASS_AUTH: 'false'

  ######################################
  # Postgres Database
  #
  # Image Location:
  # https://hub.docker.com/_/postgres
  lostcommunities_db:
    # Docker Image
    image: postgres:17-alpine

    # Container Name
    container_name: lostcommunities_db

    # Restart Container Unless Stopped
    restart: unless-stopped

    # Networks
    networks:
      - lostcommunities_network

    # Volumes
    volumes:
      - lostcommunities_db_data:/var/lib/postgresql/data:rw

    # Environment Variables
    environment:
      POSTGRES_USER: lostcommunities
      POSTGRES_PASSWORD: lostcommunities
      POSTGRES_DB: lostcommunities

volumes:
  lostcommunities_data:
  lostcommunities_uploads:
  lostcommunities_db_data:
networks:
  lostcommunities_network:
    internal: true
```

This Docker Compose file follows some best practices for deploying a Postgres container in the cloud, and even separates the database connection between our application container and the Postgres container in an internal Docker network to make it even more secure.

Once we deploy this application, we can even check that the Postgres server has our current data to ensure it is working properly:

![Postgres Running](/images/examples/07/deploy_9.png)

Now our application is ready for a full deployment!