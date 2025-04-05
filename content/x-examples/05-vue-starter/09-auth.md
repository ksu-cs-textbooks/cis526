---
title: "Authentication"
pre: "9. "
weight: 90
---

{{< youtube id >}}

## Handling User Authentication

The time has come for us to finally handle user authentication on our frontend application. There are several different pieces that need to work together seamlessly for this to work properly, so let's explore what that looks like and see what it takes to get our users properly authenticated so they can access secure data in our application.

## Pinia Store

First, since we want the user to be able to request a JWT that can be used throughout our application, it would make the most sense to store that token in a [Pinia](https://pinia.vuejs.org/) store, instead of storing it directly in any individual component. This way we can easily access the token anywhere we need it in our application, and Pinia will handle making sure it is accessible and updated as needed.

First, we'll need to install a library that we can use to decode a JWT and read the contents. Thankfully, we can easily use the [jwt-decode](https://www.npmjs.com/package/jwt-decode) library available on `npm` for this task:

```bash {title="terminal"}
$ npm install jwt-decode
```

So, let's create a new store called `Token.js` in the `src/stores` folder with the following code:

```js {title="src/stores/Token.js"}
/**
 * @file JWT Token Store
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { jwtDecode }  from "jwt-decode";
import axios from "axios";

// Define Store
export const useTokenStore = defineStore('token', () => {
  // State properties
  const token = ref('')

  // Getters
  const username = computed(() => token.value.length > 0 ? jwtDecode(token.value)['username'] : '')
  const has_role = computed(() =>
    (role) => token.value.length > 0 ? jwtDecode(token.value)['roles'].some((r) => r.role == role) : false,
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
    } catch (error) {
      token.value = ''
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
    window.location.href = '/auth/logout'
  }

  // Return all state, getters, and actions
  return {token, username, has_role, getToken, logout }
})
```

Let's take a look at each part of this Pinia store to understand how it works.

* `export const useTokenStore = defineStore('token', () => {` - this first line creates a store with the unique name of `token` and exports a function that is used to make the store available in any component. We'll use this function later on this page to access the token in the store.
* `const token = ref('')` - next, we have a section that defines the state variables we actually want to keep in this Pinia store. Each of these are reactive state variables, just like we've worked with before. In this store, we're just going to store the JWT we receive from our RESTful API backend server in the `token` variable here. 
* `const username = computed(() =>...` - following the state, we have a couple of [Computed Properties](https://vuejs.org/guide/essentials/computed.html) that act as getters for our store. The first one will decode the JWT and extra the user's username for us to use in our application.
* `const has_role = computed(() =>...` - this getter will allow us to check if the user's token has a given role listed. This will help us make various parts of the application visible to the user, depending on which roles they have. This getter is unique in that it is an anonymous function that _returns_ an anonymous function!
* `async function getToken(redirect = false)` - finally, we have a couple of actions, which are functions that can be called as part of the store, typically to retrieve the state from the server or perform some other operation on the state. The `getToken` function will use the Axios library to try and retrieve a token from the server. We have to include the `{withCredentials: true}` to direct Axios to also send along any cookies available in the browser for this request. If we receive a response, we store it in the `token` state for this store, showing that the user is correctly logged in. If not, we check and see if the response is an HTTP 401 response, letting us know that the user is not correctly logged in. If not, we can optionally redirect the user to the login page, or we can just silently fail. We'll see how both options are useful a bit later on this page. This function is written using `async/await` so we can optionally choose to `await` this function if we want to make sure a user is logged in before doing any other actions.
* `function logout()` - of course, the `logout` function does exactly what it says - it simply removes the token and then redirects the user to the logout route on the backend server. This is important to do, because it will tell the backend server to clear the cookie and also redirect us to the CAS server to make sure all of our sessions are closed. 

Finally, at the bottom, we have to remember to return every single state, getter, or action that is part of this Pinia store. 

## User Profile Component

Now that we've created a Pinia store to handle our JWT for our user, we can create a Vue component to work with the store to make it easy for the user to log in, log out, and see their information.

For this, we're going to create a new Vue component called `UserProfile.vue` and store it in the `src/components/layout` folder. It will contain the following content:

```vue {title="src/components/layout/UserProfile.vue"}
<script setup>
/**
 * @file User Profile menu option
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Avatar, Menu } from 'primevue'
import { useRouter } from 'vue-router'
const router = useRouter()

// Stores
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()
const { token } = storeToRefs(tokenStore)

// Declare State
const items = ref([
  {
    label: 'Profile',
    icon: 'pi pi-cog',
    command: () => {
      router.push({ name: 'profile' })
    },
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: tokenStore.logout,
  },
])

// Menu Popup State
const menu = ref()

// Menu Toggle Button Handler
const toggle = function (event) {
  menu.value.toggle(event)
}
</script>

<template>
  <div class="p-menubar-item">
    <!-- If the token is empty, show the login button -->
    <div v-if="token.length == 0" class="p-menubar-item-content">
      <a class="p-menubar-item-link" @click="tokenStore.getToken(true)">
        <span class="p-menubar-item-icon pi pi-sign-in" />
        <span class="p-menu-item-label">Login</span>
      </a>
    </div>

    <!-- Otherwise, assume the user is logged in -->
    <div v-else class="p-menubar-item-content">
      <a
        class="p-menubar-item-link"
        id="user-icon"
        @click="toggle"
        aria-haspopup="true"
        aria-controls="profile_menu"
      >
        <Avatar icon="pi pi-user" shape="circle" />
      </a>
      <Menu ref="menu" id="profile_menu" :model="items" :popup="true" />
    </div>
  </div>
</template>

<style scoped>
#user-icon {
  padding: 0px 12px;
}
</style>
```

As we can see, our components are slowly becoming more and more complex, but we can easily break down this component into several parts to see how it works.

```vue {title="src/components/layout/UserProfile.vue"}
// Stores
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()
const { token } = storeToRefs(tokenStore)
```

First, these three lines in the `<script setup>` portion will load our `token` store we created earlier. We first import it, then we call the `useTokenStore` function to make it accessible. Finally, we are using the `storeToRefs` function to extract any state and getters from the store and make them direct reactive state variables we can use in our component.

```vue {title="src/components/layout/UserProfile.vue"}
// Declare State
const items = ref([
  {
    label: 'Profile',
    icon: 'pi pi-cog',
    command: () => {
      router.push({ name: 'profile' })
    },
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: tokenStore.logout,
  },
])
```

Next, we are setting up the menu items that will live in the submenu that is available when a user is logged on. These use the same menu item format that we used previously in our top-level menu bar.

```vue {title="src/components/layout/UserProfile.vue"}
// Menu Popup State
const menu = ref()

// Menu Toggle Button Handler
const toggle = function (event) {
  menu.value.toggle(event)
}
```

Finally, we have a reactive state variable and a click handler function to enable our popup menu to appear and hide as users click on the profile button. 

Now, let's break down the content in the `<template>` section as well.

```vue {title="src/components/layout/UserProfile.vue"}
    <!-- If the token is empty, show the login button -->
    <div v-if="token.length == 0" class="p-menubar-item-content">
      <a class="p-menubar-item-link" @click="tokenStore.getToken(true)">
        <span class="p-menubar-item-icon pi pi-sign-in" />
        <span class="p-menu-item-label">Login</span>
      </a>
    </div>
```

Our template consists of two different parts. First, if the `token` store has an empty token, we can assume that the user is not logged in. In that case, instead of showing any user profile information, we should just show a login button for the user to click. This button is styled using some PrimeVue CSS classes to match other buttons available in the top-level menu bar.

```vue {title="src/components/layout/UserProfile.vue"}
    <!-- Otherwise, assume the user is logged in -->
    <div v-else class="p-menubar-item-content">
      <a
        class="p-menubar-item-link"
        id="user-icon"
        @click="toggle"
        aria-haspopup="true"
        aria-controls="profile_menu"
      >
        <Avatar icon="pi pi-user" shape="circle" />
      </a>
      <Menu ref="menu" id="profile_menu" :model="items" :popup="true" />
    </div>
```

However, if the user is logged in, we instead can show a clickable link that will open a submenu with a couple of options. To display the user's profile information, we are using a [PrimeVue Avatar](https://primevue.org/avatar/) component with a default user icon, but we can easily replace that with a user's profile image if one exists in our application. We are also using a [PrimeVue Menu](https://primevue.org/menu/) component to create a small popup menu if the user clicks on their profile icon. That menu includes options to view the user's profile,and also to log out of the application by calling the `logout` method in the `token` store.

We also see our first instance of a scoped CSS directive in this component:

```vue {title="src/components/layout/UserProfile.vue"}
<style scoped>
#user-icon {
  padding: 0px 12px;
}
</style>
```

In effect, the Avatar component from PrimeVue is a bit taller than the rest of the items in the top-level menu bar. By default, the `p-menuvar-item-content` class has a lot of padding above and below the element, but we've chosen to remove that padding by overriding the `padding` CSS directive on the `<a>` element with the ID `#user-icon`. This is a very powerful way to make little tweaks to the overall look and feel of our application to keep it consistent.

## Integrating the User Profile Component

Now we can add our new `UserProfile` component to our `TopMenu` component to make it visible in our application:

```vue {title="src/components/layout/TopMenu.vue" hl_lines="6 18-21"}
// -=-=- other code omitted here -=-=-

// Import Components
import Menubar from 'primevue/menubar'
import ThemeToggle from './ThemeToggle.vue'
import UserProfile from './UserProfile.vue'

// -=-=- other code omitted here -=-=-
</script>

<template>
  <div>
    <Menubar :model="items">
      <template #start>
        <img src="https://placehold.co/40x40" alt="Placeholder Logo" />
      </template>
      <template #end>
        <div class="flex items-center gap-1">
          <ThemeToggle />
          <UserProfile />
        </div>
      </template>
    </Menubar>
  </div>
</template>
```

As we've already seen before, we are simply importing the component into our file in the `<script setup>` section, and then adding it like any other HTML element in the `<template>` section. To help with layout, we've wrapped the items in the `<template #end>` slot in a `<div>` of their own, and applied a few CSS classes from Tailwind to handle [Flex Layout](https://tailwindcss.com/docs/flex), [Item Alignment](https://tailwindcss.com/docs/align-items), and [Gap Spacing](https://tailwindcss.com/docs/gap). 

## Fixing the CAS Redirect

Finally, before we can test our authentication system, we must make one change to our website's configuration. Right now, our CAS authentication system is set to redirect users back to port `3000`, which is where our backend server is running. However, we now want users to be sent back to our frontend, which is running on port `5173`. So, in our `server` folder, we need to update one entry in our `.env` file:

```env {title=".env"}
# -=-=- other settings omitted here -=-=-
CAS_SERVICE_URL=https://$CODESPACE_NAME-5173.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
```

Now, instead of referencing the `$PORT` setting, we have simply hard-coded the port `5173` used by Vite for now. Once we've changed this setting, we must remember to manually restart our backend server by either stopping and restarting it in the terminal, or by typing `rs` in the running terminal window so Nodemon will restart it. 

## Testing Authentication

At this point, we are finally ready to test our authentication setup. So, we'll need to make sure both our frontend and backend applications are running. Then, we can load our frontend application and try to click on the login button. If it works correctly, it should redirect us to the CAS server to log in. Once we have logged in, we'll be sent back to our frontend application, but the login button will still be visible. This time, however, if we click it, our frontend will be able to successfully get a token from the backend (since we are already logged in and have a valid cookie), and our frontend application will switch to show the user's profile option in the menu. 

![Vue Authentication](/images/examples/05/vue_auth.gif)

If everything is working correctly, our website should act like the example animation above! Now we just have to add a few more features to streamline this process a bit and actually request data from the server. 

## Authentication Process

Let's take a step back to examine the complexity of the authentication process for our application as it stands currently:

![Vue Auth Process](/images/examples/05/vue_cas_auth.png)

As we can see, there are lots of steps involved! It is always good to create diagrams like this in mind when developing an application - they can often be very helpful when we have to debug a complicated process like authentication. 