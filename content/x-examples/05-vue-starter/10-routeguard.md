---
title: "Route Guards"
pre: "10. "
weight: 100
---

{{< youtube id >}}

## Automatically Logging In

One thing we may quickly realize as we use our application as it currently stands is that the user has to click the "Login" button twice to actually get logged into the system. That seems a bit counterintuitive, so we should take a minute to try and fix that. 

Effectively, we want our application to try and request a token on behalf of the user behind the scenes as soon as the page is loaded. If a token can be received, we know the user is actually logged in and we can update the user interface accordingly. There are several approaches to do this:

* We can place this code in our top-level `App.vue` file - this will ensure it runs when any part of the web application is loaded
* We can place it in a [Navigation Guard](https://router.vuejs.org/guide/advanced/navigation-guards.html) inside of our Vue Router. This will allow us to make sure the user is logged in, and we can even automatically redirect the user if they try to access something that requires them to log in first

So, let's add a global navigation guard to our router, ensuring that we only have a single place that requests a token when the user first lands on the page.

## Router Navigation Guards

To do this, we need to edit the `src/router/index.js` to add a special `beforeEach` function to the router:

```js {title="src/router/index.js" hl_lines="10-11 38-61"}
/**
 * @file Vue Router for the application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports router a Vue Router
 */

// Import Libraries
import { createRouter, createWebHistory } from 'vue-router'

// Import Stores
import { useTokenStore } from '@/stores/Token'

// Import Views
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // Configure History Mode
  history: createWebHistory(import.meta.env.BASE_URL),

  // Configure routes
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

//Global Route Guard
router.beforeEach(async (to) => {
  // Load Token Store
  const tokenStore = useTokenStore();

  // Allow access to 'home' and 'about' routes automatically
  const noLoginRequired = ['home', 'about']

  if (noLoginRequired.includes(to.name)) {
    // If there is no token already
    if(!tokenStore.token.length > 0) {
      // Request a token in the background 
      tokenStore.getToken()
    }

  // For all other routes
  } else {
    // If there is no token already
    if(!tokenStore.token.length > 0) {
      // Request a token and redirect if not logged in 
      await tokenStore.getToken(true)
    }
  }
})

export default router
```

In this navigation guard, we have identified two routes, `'home'` and `'about'` that don't require the user to log in first. So, if the route matches either of those, we request a token in the background if we don't already have one, but we don't `await` that function since we don't need it in order to complete the process. However, for all other routes that we'll create later in this project, we will `await` on the `tokenStore.getToken()` function to ensure that the user has a valid token available before allowing the application to load the next page. As we continue to add features to our application, we'll see that this is a very powerful way to keep track of our user and ensure they are always properly authenticated. 

## Axios Interceptors

We can also simplify one other part of our application by automatically configuring Axios with a few additional settings that will automatically inject the `Authorization: Bearer` header into each request, as well as silently requesting a new JWT token if ours appears to have expired. 

For this, we'll create a new folder called `src/configs` and place a new file `api.js` inside of that folder with the following content:

```js {title="src/configs/api.js"}
/**
 * @file Axios Configuration and Interceptors
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import axios from 'axios'

// Import Stores
import { useTokenStore } from '@/stores/Token'

// Axios Instance Setup
const api = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Add Interceptors
const setupAxios = function() {
  // Configure Requests
  api.interceptors.request.use(
    (config) => {
      // If we are not trying to get a token or API versions, send the token
      if (config.url !== '/auth/token' && config.url !== '/api') {
        const tokenStore = useTokenStore()
        if (tokenStore.token.length > 0) {
          config.headers['Authorization'] = 'Bearer ' + tokenStore.token
        }
      }
      return config
    },

    // If we receive any errors, reject with the error
    (error) => {
      return Promise.reject(error)
    }
  )

  // Configure Response
  api.interceptors.response.use(
    // Do not modify the response
    (res) => {
      return res
    },

    // Gracefully handle errors
    async (err) => {
      // Store original request config
      const config = err.config

      // If we are not trying to request a token but we get an error message
      if(config.url !== '/auth/token' && err.response) {
        // If the error is a 401 unauthorized, we might have a bad token
        if (err.response.status === 401) {
          // Prevent infinite loops by tracking retries
          if (!config._retry) {
            config._retry = true

            // Try to request a new token
            try {
              const tokenStore = useTokenStore();
              await tokenStore.getToken();

              // Retry the original request
              return api(config)
            } catch (error) {
              return Promise.reject(error)
            }
          } else {
            // This is a retry, so force an authentication
            const tokenStore = useTokenStore();
            await tokenStore.getToken(true);
          }
        }
      }

      // If we can't handle it, return the error
      return Promise.reject(err)
    }
  )
}

export { api, setupAxios }
```

This file configures an Axios instance to only accept `application/json` requests, which makes sense for our application. Then, in the `setupAxios` function, it will add some basic interceptors to modify any requests sent from this instance as well as responses received:

* If we try to request any URL other than `/auth/token` and `/api`, we'll assume that the user is accessing a route that requires a valid bearer token. So, we can automatically inject that into our request.
* When we receive an error as a response, we'll check to see if it is an HTTP 401 Unauthorized error. If it comes from any URL except the `/auth/token` URL, we can assume that we might have an invalid token. So, we'll quickly try to request one in the background, and then retry the original request once. If it fails a second time, we'll redirect the user back to the login page so they can re-authenticate with the system.

To use these interceptors, we must first enable them in the `src/main.js` file:

```js {title="src/main.js" hl_lines="21 42-43"}
/**
 * @file Main Vue application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Tooltip from 'primevue/tooltip'

// Import CSS
import './assets/main.css'

// Import Vue App
import App from './App.vue'

// Import Configurations
import router from './router'
import { setupAxios } from './configs/api'

// Create Vue App
const app = createApp(App)

// Install Libraries
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  // Theme Configuration
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark-mode',
    },
  },
})

// Install Directives
app.directive('tooltip', Tooltip)

// Setup Interceptors
setupAxios()

// Mount Vue App on page
app.mount('#app')
```

Now, anytime we want to request data from a protected route, we can use the `api` instance of Axios that we configured!