---
title: "Routing"
pre: "4. "
weight: 40
---

{{< youtube lz0AiqcQAV4 >}}

## Vue Router

Our Vue project already includes an instance of the [Vue Router](https://router.vuejs.org/), which is used to handle routing between the various views, or pages, within our application. So, let's take a minute to explore how the Vue Router works and how we can integrate it into our Menubar so we can move between the various views in our application.

First, let's take a look at the existing `src/router/index.js` file that is generated for our application. We've added some comments to the file to make it easier to follow:

```js {title="src/router/index.js"}
/**
 * @file Vue Router for the application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 * @exports router a Vue Router
 */

// Import Libraries
import { createRouter, createWebHistory } from 'vue-router'

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

export default router
```

The major portion of this file we should look at is the `routes` array that is present inside of the `createRouter` function. Each object in the `routes` array matches a URL path with a Vue component, typically a view or page, that should be displayed at that route. We can also give each route a helpful name to make things simple. 

At the bottom, we see an example of splitting the routes up into chunks, which allows parts of our application to be lazy-loaded as the user accesses them. This can make our application initially load faster, since the default chunk is smaller, but when the user accesses a part of the application that is lazy-loaded, it may pause briefly while it loads that chunk. We'll go ahead and leave it as-is for this example, just to see what it looks like. We'll revisit this when we build our application for production.

Finally, we also see that this file configures a [History Mode](https://router.vuejs.org/guide/essentials/history-mode.html) for our application. This describes how the URL may change as users move through our application. We'll leave this setting alone for now, but as we integrate this application into our backend, we may revisit this setting. The Vue Router documentation describes the different history modes and where they are most useful.

This file is imported in our `main.js` file and added to the Vue application so we can reference it throughout our application. 

## Using the Router

Now, let's go back to our `App.vue` file, and see where it uses the Vue Router:

```vue {title="src/App.vue" hl_lines="16"}
<script setup>
/**
 * @file Main Vue Application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Components
import TopMenu from './components/layout/TopMenu.vue';
</script>

<template>
  <header>
    <TopMenu />
  </header>

  <RouterView />
</template>
```

In the template, we see a `RouterView` element - this is where the different views are placed in our overall application. For example, when the user wants to navigate to the `/about` URL, the `RouterView` component here will contain the `AboutView` component that is referenced in the router's `routes` array for that URL path. It is very straightforward!

While we're here, let's briefly update the structure of this page to match a proper HTML file:

```vue {title="src/App.vue" hl_lines="16"}
<template>
  <header></header>

  <nav>
    <!-- Navigation Menu -->
    <TopMenu />
  </nav>

  <main>
    <div>
      <!-- Main Application View -->
      <RouterView />
    </div>
  </main>

  <footer></footer>
</template>
```

This template structure properly includes a `<header>`, `<nav>`, `<main>`, and `<footer>` elements that make up the overall structure of the page. For right now, we are only using the `<nav>` and `<main>` elements, but we can always add additional content to this overall page layout over time. 

## Navigating to a View

Finally, let's go back to our `TopMenu` component and add routing to each link. There are many ways to do this, but one simple way is to add a `command` property to each menu item, which is a callback function that is executed when the button on the menu is activated. This function can simply use the Vue router to navigate to the correct view:

```vue {title="src/components/layout/TopMenu.vue" hl_lines="9-10 19-21 25-27"}
<script setup>
/**
 * @file Top menu bar of the entire application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

// Import Components
import Menubar from 'primevue/menubar';

// Declare State
const items = ref([
  {
    label: 'Home',
    command: () => {
      router.push({ name: 'home' })
    }
  },
  {
    label: 'About',
    command: () => {
      router.push({ name: 'about' })
    }
  }
])
</script>
```

Now, when we run our application, we should be able to click the buttons in our menu and navigate between the two views, or pages, of our application!

