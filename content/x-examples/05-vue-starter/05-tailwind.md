---
title: "Tailwind"
pre: "5. "
weight: 50
---

{{< youtube id >}}

## Integrating Tailwind

While PrimeVue includes many helpful components we can use in our application, we may still need to adjust the layout a bit to match our expected style. For example, right now the content of each of our views has no margins or padding around it:

![PrimeVue Menubar Logo](/images/examples/05/primevue_4.png)

While we can easily write our own CSS directives to handle this, now is a good time to look at one of the more modern CSS libraries to see how to make this process much easier. [Tailwind CSS](https://tailwindcss.com/) is a utility-based CSS framework that works really well with component libraries such as PrimeVue. So, let's integrate it into our application and use it to help provide some additional style and structure to our application.

First, we'll follow the installation guide to install [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite) by installing the library and the Vite plugin for Tailwind using `npm`:

```bash {title="terminal"}
$ npm install tailwindcss @tailwindcss/vite
```

Next, we'll need to add the Tailwind CSS plugin to our Vite configuration file `vite.config.js`:

```js {title="vite.config.js" hl_lines="6 13"}
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
```

Since we are using PrimeVue, we should also install the [PrimeVue Tailwind Plugin](https://primevue.org/tailwind/) as well:

```bash {title="terminal"}
$ npm install tailwindcss-primeui
```

Now that Tailwind is installed, we need to reference it in a global CSS file that is part of our application. So, let's create a file `main.css` in our `src/assets` folder with the following content:

```css {title="src/assets/main.css"}
@import "tailwindcss";
@import "tailwindcss-primeui";
```

We'll also need to reference that file in our `main.js` file:

```js {title="src/main.js" hl_lines="12-13"}
/**
 * @file Main Vue application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

// Import CSS
import './assets/main.css'

// Import Vue App
import App from './App.vue'

// -=-=- other code omitted here -=-=-
```

Finally, with all of that in place, we can restart our application in development mode and begin using Tailwind CSS to style our application:

```bash {title="terminal"}
$ npm run dev
```

Let's look back at our `App.vue` file and add a simple margin to the `<div>` containing our application using the [Tailwind CSS Margin](https://tailwindcss.com/docs/margin) utility. To do this, we simply add a `class="m-2"` attribute to that `<div>` element:

```vue {title="src/App.vue" hl_lines="10"}
<template>
  <header></header>

  <nav>
    <!-- Navigation Menu -->
    <TopMenu />
  </nav>

  <main>
    <div class="m-2">
      <!-- Main Application View -->
      <RouterView />
    </div>
  </main>

  <footer></footer>
</template>
```

Now, when we reload that page, we should see that the `<div>` inside of the `<main>` element of our page has a small margin around it. We can confirm this using the inspector tool in our browser:

![PrimeVue Tailwind](/images/examples/05/primevue_5.png)

There we go! Now we have full access to Tailwind CSS in our application, which will allow us to easily control the layout and spacing of the various components in our application.