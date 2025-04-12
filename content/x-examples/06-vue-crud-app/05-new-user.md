---
title: "New User"
pre: "5. "
weight: 50
---

{{< youtube id >}}

## Creating a New User

Now that we have a nice way to edit a user account, we'd like to also have a way to create a new user account. While we could easily duplicate our work in the `UserEdit` component and create a `UserNew` component, we can also add a bit more logic to our `UserEdit` component to handle both cases. So, let's look at how we can do that!

First, we'll need to add a route to our project to get us to the correct place. So, we'll update our Vue Router:

```js {title="src/router/index.js" hl_lines="10-15"}
// -=-=- other code omitted here -=-=-

const router = createRouter({
  // Configure History Mode
  history: createWebHistory(import.meta.env.BASE_URL),

  // Configure routes
  routes: [
    // -=-=- other code omitted here -=-=-
    {
      path: '/users/new',
      name: 'newuser',
      component: () => import('../views/UsersEditView.vue'),
      beforeEnter: requireRoles('manage_users'),
    },
  ],
})

// -=-=- other code omitted here -=-=-
```

This route will take us to the `UsersEditView` view, but without a prop giving the ID of the user to edit. When we get to that page without a prop, we'll assume that the user is intending to create a new user instead. So, we'll need to change some of our code in that component to handle this gracefully.

Thankfully, we can just look at the value of `props.id` for this - if it is a _falsy_ value, then we know that it wasn't provided and we are creating a new user. If one is provided, then we are editing a user instead.

So, at the start, if we are creating a new user, we want to set our `user` reactive state variable to a reasonable default value for a user. If we are editing a user, we'll request that user's data from the server.

```vue {title="src/components/users/UserEdit.vue" hl_lines="4-5 14-20"}
<script setup>
// -=-=- other code omitted here -=-=-

// Load Users
if (props.id) {
  api
    .get('/api/v1/users/' + props.id)
    .then(function (response) {
      user.value = response.data
    })
    .catch(function (error) {
      console.log(error)
    })
} else {
  // Empty Value for User Object
  user.value = {
    username: '',
    roles: []
  }
}

// -=-=- other code omitted here -=-=-
</script>
```

Then, we need to change the code for saving a user to handle both situations. Thankfully, we can adjust both the method (either POST or PUT) as well as the URL easily in Axios using the [Axios API](https://axios-http.com/docs/api_intro). 

```vue {title="src/components/users/UserEdit.vue" hl_lines="5-17"}
<script setup>
// -=-=- other code omitted here -=-=-

// Save User
const save = function () {
  errors.value = []
  let method = 'post'
  let url = '/api/v1/users'
  if (props.id) {
    method = 'put'
    url = url + '/' + props.id
  }
  api({
    method: method,
    url: url,
    data: user.value
  }).then(function (response) {
      if (response.status === 201) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: response.data.message,
          life: 5000,
        })
        router.push({ name: 'users' })
      }
    })
    .catch(function (error) {
      if (error.status === 422) {
        toast.add({
          severity: 'warn',
          summary: 'Warning',
          detail: error.response.data.error,
          life: 5000,
        })
        errors.value = error.response.data.errors
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: error, life: 5000 })
      }
    })
}
</script>
```

Since both the POST and PUT operations will return the same style of errors, the rest of the code is identical!

Finally, in our template, we can include a bit of conditional rendering to display whether we are creating a new user or editing an existing user:

```vue {title="src/components/users/UserEdit.vue" hl_lines="3"}
<template>
  <div class="flex flex-col gap-3 max-w-xl justify-items-center">
    <h1 class="text-xl text-center m-1">{{ props.id ? "Edit User" : "New User" }}</h1>
    <!-- other code omitted here -->
  </div>
</template>
```

That's really all the changes we need to make to allow our `UserEdit` component to gracefully handle both editing existing users and creating new users!

![New User](/images/examples/06/vue_crud_13.png)