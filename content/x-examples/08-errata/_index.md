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

