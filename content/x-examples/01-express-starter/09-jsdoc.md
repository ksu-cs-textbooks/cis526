---
title: "JSDoc Documentation"
pre: "9. "
weight: 90
---

{{< youtube id >}}

## JSDoc Documentation

It is also considered good practice to add additional documentation to all of the source files we create for this application. One common standard is [JSDoc](https://jsdoc.app/), which is somewhat similar to the JavaDoc comments we may have seen in previous courses. JSDoc can be used to generate documentation, but we won't be using that directly in this project. However, we will be loosely following the JSDoc documentation standard to give our code comments some consistency. We can find a full list of the tags in the [JSDoc Documentation](https://jsdoc.app/).

For example, we can add a file header to the top of each source file with a few important tags. We may also want to organize our import statements and add notes for each group. We can also document individual functions, such as the `normalizePort` function in the `bin/www` file. Here's a fully documented and commented version of that file:

```js {title="bin/www"}
/**
 * @file Executable entrypoint for the web application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import libraries
import http from 'http';

// Import Express application
import app from '../app.js';

// Import logging configuration
import logger from '../configs/logger.js';

// Get port from environment and store in Express
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server
var server = http.createServer(app);

// Listen on provided port, on all network interfaces
server.listen(port);

// Attach event handlers
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 * 
 * @param {(string|number)} val - a value representing a port to connect to
 * @returns {(number|string|boolean)} the port or `false`
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 * 
 * @param {error} error - the HTTP error event
 * @throws error if the error cannot be determined
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(new Error(bind + ' requires elevated privileges'));
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(new Error(bind + ' is already in use'));
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger.debug('Listening on ' + bind)
}
```

Here is another example of a cleaned up, reorganized, and documented version of the `app.js` file. Notice that it also includes an `@export` tag at the top to denote the type of object that is exported from this file.

```js {title="app.js"}
/**
 * @file Main Express application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports app Express application
 */

// Load environment (must be first)
import '@dotenvx/dotenvx/config';

// Import libraries
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express'

// Import configurations
import logger from './configs/logger.js';
import openapi from './configs/openapi.js'

// Import middlewares
import requestLogger from './middlewares/request-logger.js';

// Import routers
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

// Create Express application
var app = express();

// Use libraries
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(express.json());

// Use middlewares
app.use(requestLogger);

// Use static files
app.use(express.static(path.join(import.meta.dirname, 'public')));

// Use routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Use SwaggerJSDoc router if enabled
if (process.env.OPENAPI_VISIBLE === 'true') {
    logger.warn('OpenAPI documentation visible!');
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi, {explorer: true}));
}

export default app;
```

Finally, here is a fully documented `routes/index.js` file, showing how routes can be documented both with JSDoc tags as well as OpenAPI Specification items:

```js {title="routes/index.js"}
/**
 * @file Index router
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports router an Express router
 * 
 * @swagger
 * tags:
 *   name: index
 *   description: Index Routes
 */

// Import libraries
import express from "express";

// Create Express router
const router = express.Router();

/**
 * Gets the index page for the application
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @swagger
 * /:
 *   get: 
 *     summary: index page
 *     description: Gets the index page for the application
 *     tags: [index]
 *     responses:
 *       200: 
 *         description: success
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

export default router;
```

Now is a great time to document all of the JavaScript files in our application following the [JSDoc](https://jsdoc.app/) standard.

This is a good point to **commit and push** our work!