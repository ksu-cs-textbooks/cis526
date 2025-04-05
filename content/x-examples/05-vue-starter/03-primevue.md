---
title: "PrimeVue"
pre: "3. "
weight: 30
---

{{< youtube SXfu755SIcM >}}

## Install PrimeVue

One of the first things we may want to install in our application is a library of ready-to-use components that we can use to build our application with. This can drastically cut down on the time it takes to build an application, and these libraries often come with a range of features that make our applications both user-friendly and very accessible.

While there are many different libraries to choose from, we'll use the [PrimeVue](https://primevue.org/) library. PrimeVue has a very large set of components to choose from, and it is very easy to install and configure. So, let's follow the [installation guide](https://primevue.org/vite) to install PrimeVue in a project that uses Vite as it's build tool.

First, we'll need to install the library through `npm`:

```bash {title="terminal"}
$ npm install primevue @primeuix/themes
```

Once that is installed, we need to configure the plugin by adding it to our `main.js` file. We've added some documentation comments to this file to make it easily readable, but the new lines added for PrimeVue are highlighted below:

```js {title="src/main.js" hl_lines="9 23"}
/**
 * @file Main Vue application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';

// Import Vue App
import App from './App.vue'

// Import Configurations
import router from './router'

// Create Vue App
const app = createApp(App)

// Install Libraries
app.use(createPinia())
app.use(router)
app.use(PrimeVue);

// Mount Vue App on page
app.mount('#app')
```

There we go! Now we can use PrimeVue components anywhere in our application. So, let's start building a basic framework for our application's overall look and feel.

## PrimeVue Menubar Layout

A good first step is to build the overall layout that all of our views, or pages, within our application will use. This is similar to the concept of template inheritance that we've explored already in this class. For this application, let's assume we want to have a static menu bar at the top of the page that has links to other pages or views in our application across the top. On the left of that bar, we should have some settings buttons that allow the user to switch between light or dark mode, as well as a button to access their user profile and either login or logout of the system. A quick wireframe sketch of this site might look something like this:

![Vue Mockup](/images/examples/05/vue_mockup.png)

As it just so happens, as we look through the PrimeVue list of components, we see a component named [Menubar](https://primevue.org/menubar/) that has an example template that looks very similar to our existing wireframe:

![PrimeVue Menubar](/images/examples/05/vue_mockup2.png)

So, let's see if we can explore how to use this PrimeVue component and make it fit our desired website structure. Of course, there is always a little give and take to using these libraries; while we may have a very specific view or layout in mind, often it is best to let the component library guide us a bit by seeing that it already does well, and then adapting it for our needs.

## Using a PrimeVue Component

In the PrimeVue documentation, each component comes with several example templates we can use. However, by default, the template code that is visible on the website is only a small part of the whole component that is actually displayed on the screen. So, we may first want to click the "Toggle Full Code" button that appears in the upper right corner of the code panel when we hover over it - that will show us the full example component:

![PrimeVue Show Full Code](/images/examples/05/primevue_1.png)

Once we have that full code, we can explore how it works in greater detail, comparing the code shown in each example to the component we see placed above it. 

For this component, we'll build it up from scratch just to see how each part works. Once we are more familiar with PrimeVue components and how they are structured, we can copy these code examples easily into our own components and tweak them to fit our needs.

First, let's create a new folder named `layout` in our `src/components` folder, and then inside of that we can create a new Vue component named `TopMenu.vue`. Let's start by adding the two basic sections of any Vue component, the `<script setup>` and `<template>` sections:

```vue {title="src/components/layout/TopMenu.vue"}
<script setup>
/**
 * @file Top menu bar of the entire application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */
</script>

<template>
  <div>
    Content Here
  </div>
</template>
```

Next, we can import the [PrimeVue Menubar](https://primevue.org/menubar/) component in the `<script setup>` section of our component, and place it in the `<template>` section:

```vue {title="src/components/layout/TopMenu.vue" hl_lines="7-8 13"}
<script setup>
/**
 * @file Top menu bar of the entire application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Components
import Menubar from 'primevue/menubar';
</script>

<template>
  <div>
    <Menubar :model="items" />
  </div>
</template>
```

In the documentation, it says that we need to include a collection of menu items as the `model` of the component. A component's `model` can be thought of as the **viewmodel** part of the [Model View ViewModel](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) architecture pattern we may already be familiar with. In effect, PrimeVue components take care of the **view** part of this pattern, and we must adapt our existing data **model** by providing a **viewmodel** reference that fits the structure expected by the component. 

In this instance, we want our menubar to include links to the `home` and `about` pages, or views, of our application, so those will be the items we'll include. To do this, we need to create a reactive state element in Vue using the `ref()` function. For more about how reactivity works in Vue, consult the [Vue Documentation](https://vuejs.org/guide/essentials/reactivity-fundamentals.html).

```vue {title="src/components/layout/TopMenu.vue" hl_lines="7-8 13-21"}
<script setup>
/**
 * @file Top menu bar of the entire application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref } from "vue";

// Import Components
import Menubar from 'primevue/menubar';

// Declare State
const items = ref([
  {
    label: 'Home',
  },
  {
    label: 'About',
  }
])
</script>
```

At this point we've created a basic structure for our `TopMenu` component, so let's add it to our site and see what it looks like. To do this, we'll import it into our `App.vue` file and add it to the template there (we'll end up removing some content and libraries that were already included in that file, which is fine):

```vue {title="src/App.vue" hl_lines="7-8 13"}
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

Now, let's run our application in development mode and see what it looks like:

```bash {title="terminal"}
$ npm run dev
```

When we navigate to our page in the browser, we should see this layout:

![PrimeVue Basic Layout](/images/examples/05/primevue_2.png)

While this page still seems very simple, we can use the Vue DevTools to explore the page and see that our components are present. However, they aren't really styled the way we see in the PrimeVue examples. This is because we need to install a [PrimeVue Theme](https://primevue.org/theming/styled/) that provides the overall look and feel of our application.

## PrimeVue Themes

PrimeVue includes several built-in themes that we can choose from:

* Aura - this theme is the one developed exclusively for PrimeVue
* Material - this theme mimics [Google's Material Design v2](https://m2.material.io/)
* Lara - this theme is based on the styling found in [Bootstrap](https://getbootstrap.com/)
* Nora - this theme is inspired by several enterprise applications that use a simple style

We can explore what each of these themes look like by selecting them on the PrimeVue documentation website - the whole website can be themed and styled based on any of the built-in options available in PrimeVue, which is a great way for us to see what is available and how it might look on our page.

For this application, we'll use the Aura theme, so let's install it in our `main.js` file:

```js {title="src/main.js" hl_lines="10 24-29"}
/**
 * @file Main Vue application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

// Import Vue App
import App from './App.vue'

// Import Configurations
import router from './router'

// Create Vue App
const app = createApp(App)

// Install Libraries
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    // Theme Configuration
    theme: {
        preset: Aura
    }
});

// Mount Vue App on page
app.mount('#app')
```

Now, when we restart our application and refresh the page, we should see a bit of a different look and feel on the page:

![PrimeVue Aura Theme](/images/examples/05/primevue_3.png)

Now we see that our PrimeVue Menubar component is beginning to look like what we expect. We also notice that it is now using a dark theme, which is the default for the web browser this screenshot was taken from - we'll explore how to add a toggle for light and dark themes later in this tutorial. 

## PrimeVue Component Slots

Many PrimeVue components include **slots**, which are specific locations within the template where additional components or HTML code can be added. For example, the Menubar component include two slots, `#start` and `#end`, which allow us to add content at the beginning and end of the Menubar, respectively. We can use these by simply adding a `<template>` inside of our `Menubar` component with the appropriate label. So, let's do that now! 

We know we want to add a logo to the beginning of the Menubar, so let's start there. We don't currently have a logo graphic for our application, but we can include a placeholder image for now. 

```vue {title="src/components/layout/TopMenu.vue" hl_lines="3-7"}
<template>
  <div>
    <Menubar :model="items">
      <template #start>
        <img src="https://placehold.co/40x40" alt="Placeholder Logo" />
      </template>
    </Menubar>
  </div>
</template>
```

With that in place, we should now see an image included in our Menubar:

![PrimeVue Menubar Logo](/images/examples/05/primevue_4.png)

On the next page, we'll continue to refine our Menubar by adding routing.