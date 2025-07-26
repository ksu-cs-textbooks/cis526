---
title: "Errata"
pre: "8. "
weight: 80
---

This page lists all of the errors found and updates I have made to the basic project since this was released. 

## Client

### Update Token Store 

In my Vue code, I was often using `tokenStore.token.length > 0` to determine if a user was logged in. This is a bit fragile - better to just make a computed value for this:

```js {title="client/src/stores/Token.js"}
  // Getters
  const loggedIn = computed(() => 
    token.value.length > 0
  )
```

This requires changing several other places in ths code where this is used - mainly I just searched for `token.length` and went from there.

I also chose to update it to store the decoded value directly as a state property, just to avoid decoding it multiple times. Finally, I fixed a bug where users with no role would cause issues. Here is the fully updated token store. 

```js {title="client/src/stores/Token.js"}
/**
 * @file JWT Token Store
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

// Define Store
export const useTokenStore = defineStore('token', () => {
  // State properties
  const token = ref('')
  const decoded = ref({})

  // Getters
  const loggedIn = computed(() => 
    token.value.length > 0
  )
  const username = computed(() =>
    decoded.value.username ? decoded.value.username  : decoded.value.email ? decoded.value.email : '',
  )
  const has_role = computed(
    () => (role) =>
      decoded.value.roles ? decoded.value.roles.some((r) => r.role == role) : false,
  )

  // Actions
  /**
   * Get a token for the user.
   *
   * If this fails, redirect to authentication page if parameter is true
   *
   * @param redirect if true, redirect user to login page on failure
   */
  async function getToken(redirect = false) {
    console.log('token:get')
    try {
      const response = await axios.get('/auth/token', { withCredentials: true })
      token.value = response.data.token
      decoded.value = jwtDecode(token.value)
    } catch (error) {
      token.value = ''
      decoded.value = {}
      // If the response is a 401, the user is not logged in
      if (error.response && error.response.status === 401) {
        console.log('token:get user not logged in')
        if (redirect) {
          console.log('token:get redirecting to login page')
          window.location.href = '/auth/cas'
        }
      } else {
        console.log('token:get error' + error)
      }
    }
  }

  /**
   * Log the user out and clear the token
   */
  function logout() {
    token.value = ''
    decoded.value = {}
    window.location.href = '/auth/logout'
  }

  // Return all state, getters, and actions
  return { token, loggedIn, username, has_role, getToken, logout }
})
```

### Switch from date-fns to Day.js

The [date-fns](https://date-fns.org/) library has an issue where an invalid date will cause an uncaught exception in the browser, which crashes the Vue application. This can happen when the date is rendered _before_ the data is loaded, as would be the case anytime the data is loaded asynchronously when visiting the page. This was causing all sorts of strange errors in my code upon a refresh of specific pages.

I swapped to using [Day.js](https://day.js.org/en/) instead, which provides many of the same features as `date-fns` but **without** unhandled exceptions. I especially use the [Time from now](https://day.js.org/docs/en/display/from-now) feature in many places, such as my `UsersList.vue` component:

```vue {title="client/src/components/users/UsersList.vue"}
<Column field="createdAt" header="Created" sortable>
  <template #body="{ data }">
    <span v-tooltip.bottom="new Date(data.createdAt).toLocaleString()">
      {{ dayjs(data.createdAt).fromNow() }}
    </span>
  </template>
</Column>
```

### Loading Icons on Data Tables

On most of the data tables, I added a loading icon implementation, such as the `UsersList.vue` component:

```vue {title="src/components/users/UsersList.vue" hl_lines="5 8-10 24"}
<script setup>
//  -=-=- other code omitted here -=-=-

// Loading State
const loading = ref(true)

// Hydrate Store
userStore.hydrate().then(() => {
  loading.value = false
})

//  -=-=- other code omitted here -=-=-
</script>

<template>
  <DataTable
    :value="users"
    v-model:filters="filters"
    :globalFilterFields="['username', 'email', 'name']"
    filterDisplay="menu"
    sortField="username"
    :sortOrder="1"
    :loading="loading"
    loading-icon="pi pi-spin pi-spinner"
  >
  <!-- -=-=- other code omitted here -=-=- -->
  </DataTable>
</template>
```

This also requires the store to return the appropriate type so it can be handled asyncrhonously (in this case, the user store returns the promise from getting the user's list, but the roles list can happen in the background):

```js {title="src/stores/user.js"}
async function hydrate() {
    api
      .get('/api/v1/roles')
      .then(function (response) {
        roles.value = response.data
      })
      .catch(function (error) {
        console.log(error)
      })

    return api
      .get('/api/v1/users')
      .then(function (response) {
        users.value = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  }
```

### Fix Data Type Errors in Form Components

In several of the form components, I set the `invalid` attribute based on the `error` computed value. In theory, if `error` is `null`, then the `invalid` attribute will not be set. However, Vue properly tries to parse the `error` value into a Boolean, which will cause errors in the browser console.

To fix this, we can convert the presence (or absence) of the `error` object into a boolean using `!!error`. It works like this:

* If `error` is `null`, then `!error` is `true`, therefore `!!error` is `false`.
* If `error` is not `null`, then `!error` is `false`, therefore `!!error` is `true`.

To fix this, update the template in any `form` components in `client/src/components/forms` that use the `invalid` attribute as shown here, taken from the `TextField.vue` component:

```vue {title="components/forms/TextField.vue" hl_lines="9"}
<template>
  <div>
    <FloatLabel variant="on">
      <IconField>
        <InputIcon :class="props.icon" />
        <InputText
          :id="props.field"
          :disabled="props.disabled"
          :invalid="!!error"
          v-model="model"
          class="w-full"
        />
      </IconField>
      <label :for="props.field">{{ props.label }}</label>
    </FloatLabel>
    <!-- Error Text -->
    <Message v-if="error" severity="error" variant="simple" size="small">{{
      error.message
    }}</Message>
  </div>
</template>
```

## Server

### Use Default Express Error Handlers

In my code, I added a `try...catch` block to each route handler. This can be good practice, but it is also inefficient. I have since removed all of them and switched to using this global error handler at the very end of my `app.js` code:

```js {title="server/app.js"}
// Default Error Handler
app.use((err, req, res, next) => {
  // If error already sent, disregard
  if (res.headersSent) {
    return next(err);
  }
  // Handle Validation Errors
  if (err instanceof ValidationError) {
    handleValidationError(err, res);
  } else {
    logger.error(err);
    res.status(500).end();
  }
});
```

This greatly shortens and simplifies the code for each route, and makes coverage testing a bit more straightforward (since each route no longer has an error path that cannot be easily tested)

### Better Sequelize Error Handler

I also added a custom format to the Winston logger to better handle the exceptions generated by Sequelize. At the same time, I enabled Winston's ability to catch and log unahndled exceptions and rejected promises:

```js {title="configs/logger.js"}
// Import libraries
import winston from "winston";
import { format } from "winston";

/**
 * Custom formatter for Sequelize Logs
 */
const sequelizeErrors = format((info) => {
  // Adapted from https://github.com/sequelize/sequelize/issues/14807#issuecomment-1853514339
  if (info instanceof Error && info.name.startsWith("Sequelize")) {
    let { message } = info.parent;
    if (info.sql) {
      message += "\nSQL: " + info.sql;
    }

    if (info.parameters) {
      const stringifiedParameters = JSON.stringify(info.parameters);
      if (
        stringifiedParameters !== "undefined" &&
        stringifiedParameters !== "{}"
      ) {
        message += "\nParameters: " + stringifiedParameters;
      }
    }
    // Stack is already included in the error
    // message += "\n" + info.stack;

    // Update the message
    info.message = info.message += "\n" + message
  }
  return info
})

//  -=-=- other code omitted here -=-=-

// Creates the Winston instance with the desired configuration
const logger = winston.createLogger({
  // call `level` function to get default log level
  level: level(),
  levels: levels,
  // Format configuration
  // See https://github.com/winstonjs/logform
  format: combine(
    sequelizeErrors(),
    errors({ stack: true }),
    colorize({ all: true }),
    //shortFormat(),
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
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()],
});
```

This provides much more useful output whenever there are unhandled SQL exceptions such as violated validation constraints. 

### Better Passport User Sessions

I updated the Passport user sessions to only store a user's ID instead of a full user object. This is because we are only using the Passport sessions to issue a JWT (at least at this point), so a full user session is not needed. It also fixes issues where user data was not updated properly in the session after editing.

```js {title="configs/auth.js"}
//  -=-=- other code omitted here -=-=-

// Default functions to serialize and deserialize a session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (user_id, done) {
  // We could change this to look up the user in the database here in the future
  // Instead, we make a dummy object that just contains the user's ID as a stand-in
  done(null, {
    id: user_id
  });
});
```

With this change, we now have to look up the user in the database each time we issue a token. This is preferred, as it will get the current user's profile information and roles each time a token is issued.

```js {title="routes/auth.js"}
router.get("/token", async function (req, res, next) {
  // If user is logged in
  if (req.user) {
    // Load user from database
    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "username",
      ],
      include: {
        model: Role,
        as: "roles",
        attributes: ["id", "role"],
        through: {
          attributes: [],
        },
      },
    });
    if (user) {
      const token = jsonwebtoken.sign(user, process.env.JWT_SECRET_KEY, {
        expiresIn: "6h",
      });
      res.json({
        token: token,
      });
    } else {
      // user not found - probably deleted recently
      res.status(404).end()
    }
  } else {
    // Send unauthorized response
    res.status(401).end();
  }
});
```

### Fix Authorized Roles Middleware

The original `authorized-roles.js` middleware would accidentally call the `next()` handler for each matching role, instead of just the first one. The fix is to wrap the call in an `if` statement to confirm that a match has not already been found.

```js {title="middlewares/authorized-roles.js" hl_lines="16-19"}
const roleBasedAuth = (...roles) => {
  return function roleAuthMiddleware(req, res, next) {
    // logger.debug("Route requires roles: " + roles);
    // logger.debug(
    //   "User " +
    //     req.token.username +
    //     " has roles: " +
    //     req.token.roles.map((r) => r.role).join(","),
    // );
    let match = false;
    // loop through each role given
    roles.forEach((role) => {
      // if the user has that role, then they can proceed
      if (req.token.roles.some((r) => r.role === role)) {
        // logger.debug("Role match!");
        if (!match) {
          match = true;
          return next();
        }
      }
    });
    if (!match) {
      // if no roles match, send an unauthenticated response
      // logger.debug("No role match!");
      return res.status(401).send();
    }
  };
};
```