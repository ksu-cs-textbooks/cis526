---
title: "Icons"
pre: "7. "
weight: 70
---

{{< youtube KpEp43qcQNo >}}

## Adding Icons

One of the best ways to make a web user interface very accessible and easy to use is by using globally recognized icons to represent certain actions, such as logging in, returning to the homepage, and editing items. Thankfully, there is an easy to use icon package that works directly with PrimeVue called [PrimeIcons](https://primevue.org/icons/) that we can use in our project. So, let's quickly install that icon pack and see how we can use it in our application.

{{% notice note "Other Icon Packs" %}}

PrimeVue also supports using other icon packs, such as [FontAwesome](https://fontawesome.com/) as described in the [PrimeVue Custom Icons](https://primevue.org/customicons/) documentation. For this project, we'll keep things simple by only using PrimeIcons, but it is relatively easy to add additional icons from other sources as needed.

{{% /notice %}}

First, let's install the PrimeIcons package using `npm`:

```bash {title="terminal"}
$ npm install primeicons
```

Next, we can simply import the required CSS file in our `src/assets/main.css` file:

```css {title="src/assets/main.css" hl_lines="4"}
@import 'tailwindcss';
@import 'tailwindcss-primeui';
@custom-variant dark (&:where(.my-app-dark, .my-app-dark *)); 
@import 'primeicons/primeicons.css';
```

With those two changes in place, we can start to use icons throughout our application! We can find a full list of icons available in the [PrimeIcons Documentation](https://primevue.org/icons/).

## Menubar Icons

Let's start by adding a couple of icons to our menu bar links. Thankfully, the [PrimeVue Menubar Component](https://primevue.org/menubar/) recognizes an `icon` attribute that we can add to each of the menu items, so this is an easy update to make:

```js {title="src/components/layout/TopMenu.vue"}
<script setup>
// -=-=- other code omitted here -=-=-

// Declare State
const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push({ name: 'home' })
    },
  },
  {
    label: 'About',
    icon: 'pi pi-info-circle',
    command: () => {
      router.push({ name: 'about' })
    },
  },
])
</script>
```

With that change, we now see those icons appear next to our buttons on the menu bar:

![PrimeVue Icons](/images/examples/05/primevue_icons1.png)

## Theme Toggle Icons

We can also update our button to toggle the theme to just use icons! All we have to do is update the template to use icons instead of text:

```vue {title="src/components/layout/ThemeToggle.vue" hl_lines="8 13"}
<template>
  <div class="p-menubar-item">
    <div class="p-menubar-item-content">
      <a @click="toggleDarkMode" class="p-menubar-item-link">
        <span
          v-if="theme == 'light-theme'"
          v-tooltip.bottom="'Toggle Dark Mode'"
          class="p-menubar-item-label pi pi-moon"
        ></span>
        <span
          v-else
          v-tooltip.bottom="'Toggle Light Mode'"
          class="p-menubar-item-label pi pi-sun"
        ></span>
      </a>
    </div>
  </div>
</template>

```

Here, we remove the text from within the `<span>` elements, and instead add the classes `pi pi-moon` for the button to switch to dark mode, and `pi pi-sun` to switch to light mode, respectively. Since we have enabled tooltips, it is still pretty easy for our users to figure out what these buttons do and how they work!

![PrimeVue Icons Toggle](/images/examples/05/primevue_icon.gif)

As we can see, adding some icons to our website makes it feel much simpler and easier to use, without a bunch of text cluttering up the interface!

Now is a great time to lint, format, and then commit and push our work!