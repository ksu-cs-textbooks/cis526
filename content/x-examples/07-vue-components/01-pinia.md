---
title: "Pinia"
pre: "1. "
weight: 10
---

{{< youtube id >}}

## Props

So far, we've mostly been dealing with data in our Vue components in one of two ways:

1. It is requested directly from the RESTful API for the component (as in the `UsersList` and `UserEdit` components)
2. It is passed in from a parent component, especially if it is a small helper component (as in the `RoleChip` and `TextField` components)

The only exception is the user's JSON Web Token (JWT), which we have stored in a Pinia store. However, we didn't spend much time talking about _why_ we stored that token in a Pinia store instead of just making it a global reactive state component and passing that state down the component tree using props.

The concept of passing props down through components, especially between many layers of components, is known as [Prop Drilling](https://vuejs.org/guide/components/provide-inject)

![Prop Drilling](/images/examples/07/prop-drilling.png)[^1]

While this method can work well, it can also make an application very complicated with the sheer number of props that must be passed through each component. For example, imagine if each page and component needed access to the user's JWT to determine which actions to allow (a very real example from the project we are working). In that case, each component may need to be aware of the token as an incoming prop, and may also need to pass it along to any child components that may need it, even if it is three or four layers deep.

[^1]: Image Source: [Pinia Documentation](https://vuejs.org/guide/components/provide-inject)

## Provide / Inject

The Vue framework itself does have a solution to this problem, which is the [Provide / Inject](https://vuejs.org/guide/components/provide-inject) interface. In effect, a component can declare a reactive state item and add it to a global dictionary of state items that are available using the `provide` method along with a unique key for that item, and any other component can receive a reference to that state item using the `inject` method with the same key. 

![Provide Inject](/images/examples/07/provide-inject.png)[^1]

This is a bit of an improvement, but still has many issues that are discussed in the documentation. For example, it is best to only modify the state at the top-level component that is providing the state, so an additional function may need to be provided to enable proper editing of the state. In addition, for large apps it can be very difficult to ensure that each key is unique, and having hundreds or thousands of keys to keep track of can be a huge burden for programmers. 

## Pinia

The [Pinia](https://pinia.vuejs.org/) library tries to solve all of these issues by providing convenient _stores_ for different types of information in the application. Each store is typically oriented toward a specific type of data (such as users or documents), and it contains all the methods needed to read and modify the state as needed. Then, each component that needs access to the state can simply request a reference to the stores it needs, and everything is nicely compartmentalized and easy to maintain.

To see how this can help simplify our application, let's look at how we can create a `Users` store to interface with our RESTful API and maintain a globally-accessible store for data about our users.

## Creating a Pinia Store

To create a Pinia store, we can create a new file `src/stores/User.js` with the following initial content:

```js {title="src/stores/User.js"}
/**
 * @file User Store
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/configs/api'

// Define Store
export const useUserStore = defineStore('user', () => {
    // State Properties

    // Getters

    // Actions

    // Return all state, getters, and actions
    return { }
})
```

This is a nice starting structure for a store. At the bare minimum, we use the [defineStore](https://pinia.vuejs.org/core-concepts/) method from Pinia to create the store. Inside of that method is a lambda function that actually defines the contents of the store itself, which we'll iteratively build over time. We've also imported a few useful library functions, including our pre-built Axios API interface to make it easy to send requests to our API.

## Properties



## Getters

## Actions


