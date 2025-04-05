---
title: "Dark Mode"
pre: "6. "
weight: 60
---

{{< youtube 6NaPnajdLyo >}}

## Configuring Dark Mode

Many applications today include two default themes, a "light-mode" and a "dark-mode," and users can choose which theme they receive by default through settings made either in their browser or their operating system. However, we can easily provide functionality in our application for users to override that setting if desired. The instructions for configuring a proper dark mode setup can be found in the [Tailwind CSS Documentation](https://tailwindcss.com/docs/dark-mode), the [PrimeVue Documentation](https://primevue.org/theming/styled/#darkmode), and a [helpful article](https://dev.to/abbeyperini/dark-mode-toggle-and-prefers-color-scheme-4f3m) describing how to detect the user's preference and store it in the browser's local storage. We'll integrate all three of these together into our component.

To begin, we need to configure both PrimeVue and Tailwind to look for a specific CSS class applied to the base `<html>` element to control whether the page is viewed in dark mode or light mode. For this application, we'll use the class `app-dark-mode`. So, let's start by adding it to the PrimeVue configuration in `main.js`:

```js {title="src/main.js" hl_lines="10-12"}
// -=-=- other code omitted here -=-=-

// Install Libraries
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    // Theme Configuration
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark-mode',
        }
    }
});

// -=-=- other code omitted here -=-=-
```

Next, we'll use the same class in a setting for Tailwind in the base `main.css` file:

```css {title="src/assets/main.css" hl_lines="3"}
@import 'tailwindcss';
@import 'tailwindcss-primeui';
@custom-variant dark (&:where(.app-dark-mode, .app-dark-mode *));     //dark mode configuration
```

At this point, when we refresh our page in development mode, it should switch back to the light mode view. 

![PrimeVue Light Mode](/images/examples/05/primevue_light.png)

However, if we manually add the `app-dark-mode` class to the `<html>` element in our `index.html` file, it will switch to dark mode. Let's give it a try:

```html {title="index.html" hl_lines="2"}
<!DOCTYPE html>
<html lang="" class="app-dark-mode">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lost Communities Solution</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

After we add that class to our `<html>` element, the page should immediately refresh if we are running in development mode, and now it should be using dark mode:

![PrimeVue Dark Mode](/images/examples/05/primevue_dark.png)

Let's go ahead and remove that class from the `index.html` file so that our default is still light mode. Instead, we'll learn how to control it programmatically!

```html {title="index.html" hl_lines="2"}
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lost Communities Solution</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

## Controlling Dark Mode

Let's create a component we can use in our website to control dark mode. That allows the user to easily switch between light and dark modes, and we can even save their preference for later. So, let's start by creating a component in the file `src/components/layout/ThemeToggle.vue` with the following content:

```vue {title="src/components/layout/ThemeToggle.vue"}
<script setup>
/**
 * @file Button to toggle light/dark theme
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref } from 'vue'

// Declare State
const theme = ref('light-theme')

const toggleDarkMode = function() {
  if (theme.value == 'light-theme') {
    theme.value = 'dark-theme'
    document.documentElement.classList.add('app-dark-mode');
  } else {
    theme.value = 'light-theme'
    document.documentElement.classList.remove('app-dark-mode');
  }
}
</script>

<template>
  <div>
    <a @click="toggleDarkMode">
      <span v-if="theme == 'light-theme'" v-tooltip.bottom="'Toggle Dark Mode'">Dark</span>
      <span v-else v-tooltip.bottom="'Toggle Light Mode'">Light</span>
    </a>
  </div>
</template>
```

There is a lot going on in this component, so let's break it down piece by piece to see how it works. First, here are the three major components of the `<script setup>` section. 

1. We start by importing the `ref` function from Vue. This is the function that allows us to create reactive state variables in our application. A reactive state variable stores data that will be updated as our application runs, and each update will cause the user interface to be updated and redrawn for the user. Therefore, by storing our data in these reactive state variables, it allows our web application to _react_ to changes in state. We can learn more about this in the [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html) page of the Vue Documentation
2. Next, we create a reactive variable named `theme` that initially stores the string `'light-theme'`. We'll use this variable to keep track of the current theme being used by our site.
3. After that, we create a function called `toggleDarkMode` that does exactly what the name implies. First, it looks at the value of the `theme` reactive state variable. Notice that we must call the `value` property to access or update the value stored in the reactive state variable in our `<script setup>` section. Then, based on the value it finds, it will swap the theme by updating the value of the `theme` variable itself, and also either adding or removing the `app-dark-mode` class to the `document.documentElement` part of our page. According to the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement), that is typically the root element of the document, so in our case, it is the `<html>` element at the top level of our application. 

Next, here is how the template is structured:

1. Inside of the template, we wrap everything in a `<div>`. While this is not strictly necessary, it helps to ensure everything inside of the component is properly isolated. We can also apply Tailwind CSS classes to this outermost `<div>` in order to adjust the size, layout, or spacing of our component. 
2. Next, we include an `<a>` element, which we should remember represents a clickable link. However, instead of including an `href` attribute, we instead use the Vue `@click` attribute to attach a click handler to the element. This is covered in the [Event Handling](https://vuejs.org/guide/essentials/event-handling) section of the Vue documentation. So, when this link is clicked, it will call the `toggleDarkMode` function to switch between light and dark mode.
3. Inside of the `<a>` element, we have two `<span>` elements. The first one uses a `v-if` directive to check and see if the theme is currently set to the `'light-theme'` value. This is an example of [Conditional Rendering](https://vuejs.org/guide/essentials/conditional.html), one of the most powerful features of a web framework such as Vue. Effectively, if that statement resolves to `true`, this element will be rendered on the page. If it is `false`, the element will not be rendered at all. Likewise, the following span containing a `v-else` directive will be rendered if the first one is not, and vice-versa. Effectively, only one of these two `<span>` elements will be visible, based on whether the theme is currently set to `'light-theme'` or `'dark-theme'`. 

As we can see, there is a lot going on even in this very simple component!

## Adding Components to our Menu Bar

Now that we've created our `ThemeToggle` component, let's add it to our existing menu bar by updating the code in our `TopMenu.vue` component:

```vue {title="src/components/layout/TopMenu.vue" hl_lines="6 17-19"}
<script setup>
// -=-=- other code omitted here -=-=-

// Import Components
import Menubar from 'primevue/menubar'
import ThemeToggle from './ThemeToggle.vue'

// -=-=- other code omitted here -=-=-
</script>

<template>
  <div>
    <Menubar :model="items">
      <template #start>
        <img src="https://placehold.co/40x40" alt="Placeholder Logo" />
      </template>
      <template #end>
        <ThemeToggle />
      </template>
    </Menubar>
  </div>
</template>
```

To add a component, we first must import it in our `<script setup>` section. Then, we can add it to our template just like any other HTML element. In this case, we want it at the end of our menu bar, so we are adding it to the `#end` slot of that PrimeVue component. 

Now, if we load our page, we should see a button in the upper right that allows us to switch between light and dark theme!

![PrimeVue Dark Mode](/images/examples/05/primevue_toggle.gif)

## User Preference & Storage

Let's quickly improve our dark theme toggle by adding two additional features:

1) Right now, the website defaults to the light theme. However, if the user has already set a system preference for dark theme, we should respect that if no other setting has been made.
2) Once the user changes the theme, we should remember that setting so the next time they reload the page, it will use their previous setting if one is found.

So, let's update the code in our `ThemeToggle.vue` component to handle these cases by adding a few more functions:

```vue {title="src/components/layout/ThemeToggle.vue"}
<script setup>
/**
 * @file Button to toggle light/dark theme
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref } from 'vue'

// Declare State
const theme = ref('light-theme')

// Get Theme from Local Storage
const getTheme = function() {
  return localStorage.getItem('user-theme')
}

// Get Theme from User Preference
const getMediaPreference = function() {
  const hasDarkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (hasDarkPreference) {
    return 'dark-theme'
  } else {
    return 'light-theme'
  }
}

// Set theme and store
const setTheme = function() {
  console.log("Setting theme to " + theme.value)
  if (theme.value == 'light-theme') {
    document.documentElement.classList.remove('app-dark-mode');
  } else {
    document.documentElement.classList.add('app-dark-mode');
  }
  localStorage.setItem('user-theme', theme.value)
}

// Toggle theme value
const toggleDarkMode = function() {
  if (theme.value == 'light-theme') {
    theme.value = 'dark-theme'
  } else {
    theme.value = 'light-theme'
  }
  setTheme()
}

theme.value = getTheme() || getMediaPreference()
setTheme()
</script>
```

Let's go through the updates to this code and explore how it works:

1) First, we have a new function `getTheme` that will read a value from our browser's [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). This allows our application to save some settings that will be stored across browser sessions, as long as the user does not clear their browser's cache. For this application, we will store the user's chosen theme using the `'user-theme'` key in local storage.
2) Next, we have another function to get the user's preferred theme by checking for a `prefers-color-scheme` entry in the browser's settings. If it finds that the setting is set to `dark` it will return our `dark-theme` option; otherwise it will default to the `light-theme`. 
3) After that, we created a new `setTheme` function that will set the theme to whatever value is stored currently in the `theme` reactive state variable. It does so by adding or removing the class from the `<html>` element, and then it stores the current theme in the users's local storage. We added a `console.log` statement so we can debug this setup using our browser's console.
4) We also updated our `toggleDarkMode` function to just change the value stored in the `theme` reactive state variable, and then it calls the new `setTheme()` function to actually update the theme. 
5) Finally, at the bottom of the `<script setup>` section are two lines of code that actually call these functions to determine the correct theme and set it. First, we call `getTheme()` to see if the user has a theme preference stored in local storage. If so, that value is returned and stored in the `theme` reactive state. However, if there is no entry in the browser's local storage, that function will return a `null` value, and the or `||` operator will move on to the second function, `getMediaPreference()` which will try to determine if the user has system preference set. That function will always return a value. Finally, once we've determined the correct theme to use, the `setTheme` function is called to update the browser. It will also store the theme in the browser's local storage, so the user's setting will be remembered going forward. 

With all of that put together, our application should now seamlessly switch between light and dark themes, and remember the user's preference in local storage so that, even if they refresh the page, their theme preference will be remembered. We can see this setup in action below, showing both the page and the browser's local storage. Notice that the browser prefers a dark theme, so the first time the page is refreshed, it will automatically switch to dark mode. From there, the user can change the theme and refresh the page, and it will remember the previous setting.

![PrimeVue Dark Mode](/images/examples/05/primevue_toggle2.gif)

Finally, if we want our dark mode selector button to look like it belongs on our menubar, we can add a few PrimeVue CSS classes so that it matches the existing buttons. These are all explained on the [Menubar Theming](https://primevue.org/menubar/) tab of the PrimeVue documentation.

```vue {title="src/components/layout/ThemeToggle.vue"}
<template>
  <div class="p-menubar-item">
    <div class="p-menubar-item-content">
      <a @click="toggleDarkMode" class="p-menubar-item-link">
        <span v-if="theme == 'light-theme'" v-tooltip.bottom="'Toggle Dark Mode'" class="p-menubar-item-label">Dark</span>
        <span v-else v-tooltip.bottom="'Toggle Light Mode'" class="p-menubar-item-label">Light</span>
      </a>
    </div>
  </div>
</template>
```

All of the PrimeVue CSS classes are prefixed with a `p-`, so they are easy to find and remember. So, even if we create our own components, we can still easily style them to match the other PrimeVue components by paying close attention to the CSS classes used.

## Enabling Tooltips

One thing we included in the template above is the `v-tooltip.bottom` directive, which will give a small popup for the user letting them know a bit more information about what that button does. To enable it, we need to import that PrimeVue feature into our `main.js` file:

```js {title="src/main.js" hl_lines="11 38-39"}
/**
 * @file Main Vue application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Tooltip from 'primevue/tooltip';

// Import CSS
import './assets/main.css'

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
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark-mode',
    },
  },
})

// Install Directives
app.directive('tooltip', Tooltip);

// Mount Vue App on page
app.mount('#app')
```

We'll see this in action as we hover over the button to toggle between dark and light mode. 

![PrimeVue Tooltips](/images/examples/05/primevue_tooltip.png)