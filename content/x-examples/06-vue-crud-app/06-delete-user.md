---
title: "Delete User"
pre: "6. "
weight: 60
---

{{< youtube id >}}

## Deleting a User

Finally, let's look at what it takes to delete a user. As with anything in frontend development, there are many different ways to go about this. We could follow the model we used for creating and editing users by adding a new view, route, and component for these actions. However, we can also just add a quick pop-up dialog directly to our `UsersList` component that will confirm the deletion before sending the request to the backend. 

For this operation, we're going to use the [PrimeVue ConfirmDialog](https://primevue.org/confirmdialog/) component. So, to begin, we need to install the `ConfirmationService` for these dialogs in our application by editing the `main.js` file:

```js {title="src/main.js" hl_lines="13 41"}
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
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

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
app.use(ToastService)
app.use(ConfirmationService)

// Install Directives
app.directive('tooltip', Tooltip)

// Setup Interceptors
setupAxios()

// Mount Vue App on page
app.mount('#app')
```

In addition, we'll add the component itself to the `App.vue` top-level component alongside the `Toast` component, so it is visible throughout our application:

```vue {title="src/App.vue" hl_lines="9 31"}
<script setup>
/**
 * @file Main Vue Application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Components
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import TopMenu from './components/layout/TopMenu.vue'
</script>

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

  <Toast position="bottom-right" />
  <ConfirmDialog />
</template>
```

Now, in our `UsersList` component, we can configure a confirmation dialog in our `<script setup>` section along with a function to actually handle deleting the user from our data:

```vue {title="src/components/users/UsersList.vue" hl_lines="19-22 26-48 50-69"}
<script setup>
/**
 * @file Users List Component
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref } from 'vue'
import { api } from '@/configs/api'
import { formatDistance } from 'date-fns'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { IconField, InputIcon, InputText, MultiSelect } from 'primevue'
import { FilterMatchMode, FilterService } from '@primevue/core/api'
import RoleChip from '../roles/RoleChip.vue'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
const router = useRouter()
import { useToast } from 'primevue/usetoast'
const toast = useToast()
import { useConfirm } from 'primevue'
const confirm = useConfirm();

// -=-=- other code omitted here -=-=-

// Delete User
const deleteUser = function (id) {
  api
    .delete('/api/v1/users/' + id)
    .then(function (response) {
      if (response.status === 200) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: response.data.message,
          life: 5000,
        })
        // Remove that element from the reactive array
        users.value.splice(
          users.value.findIndex((u) => u.id == id),
          1,
        )
      }
    })
    .catch(function (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: error, life: 5000 })
    })
}

// Confirmation Dialog
const confirmDelete = function (id) {
  confirm.require({
    message: 'Are you sure you want to delete this user?',
    header: 'Delete User',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      deleteUser(id)
    },
  })
}
</script>
```

In this code, the `deleteUser` function uses the Axios API instance to delete the user with the given ID. Below that, we have a function that will create a confirmation dialog that follows an example given in the [PrimeVue ConfirmDialog](https://primevue.org/confirmdialog/) documentation for an easy to use dialog for deleting an element from a list.

Finally, to use this dialog, we can just update our button handler for the delete button in our template to call this `confirmDelete` function with the ID provided:

```vue {title="src/components/users/UsersList.vue" hl_lines="26"}
<template>
  <DataTable
    :value="users"
    v-model:filters="filters"
    :globalFilterFields="['username']"
    filterDisplay="menu"
    sortField="username"
    :sortOrder="1"
  >
    <!-- other code omitted here -->
    <Column header="Actions" style="min-width: 8rem">
      <template #body="slotProps">
        <div class="flex gap-2">
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            @click="router.push({ name: 'edituser', params: { id: slotProps.data.id } })"
            v-tooltip.bottom="'Edit'"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="confirmDelete(slotProps.data.id)"
            v-tooltip.bottom="'Delete'"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
```

Now, we can easily delete users from our users list by clicking the Delete button and confirming the deletion in the popup dialog!

![New User](/images/examples/06/crud_delete1.gif)

At this point, our application is now able to perform all of the basic CRUD operations for the users in our application. We can get a list of existing users, create new users, update the existing users, and delete any users we want to delete. All that is left at this point is to lint and format our code, then commit and push!

{{% notice warning "Be Careful about Functions vs. Lambdas" %}}

This particular example exposes one of the things we must be extremely careful about when working in JavaScript. Even though it may be more straightforward to use direct function calls in our code, there are times where we must use a lambda function that itself calls the function we want to use, especially when dealing with the event-driven design of many user interface libraries.

A great example is the confirmation dialog code in this component. The `accept` property lists the function that should be called when the user clicks the button to accept the change. Right now it is a lambda function that calls our `deleteUser` function, but what if we change it to just call the `deleteUser` function directly?

```vue {title="src/components/users/UsersList.vue" hl_lines="19-20"}
<script setup>
// -=-=- other code omitted here -=-=-

// Confirmation Dialog
const confirmDelete = function (id) {
  confirm.require({
    message: 'Are you sure you want to delete this user?',
    header: 'Delete User',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    // don't do this
    accept: deleteUser(id),
  })
}
</script>
```

Unfortunately, what will happen is this function will be called as soon as the dialog is created, but **BEFORE** the user has clicked the button to accept the change. We can see this in the animation below - the user is deleted from the list even before we click the button in the popup dialog:

![New User](/images/examples/06/crud_delete2.gif)

This happens because the `confirmDelete` function is trying to get a function _pointer_ for the `accept` property, so it executes the code inside of that property, expecting it to return a function. Instead, however, it just deletes the user from the list!

So, we need to remember to wrap that function in a lambda function that will return a pointer to the function we want to use, complete with the parameter of `id` already populated. 

```vue {title="src/components/users/UsersList.vue" hl_lines="19-22"}
<script setup>
// -=-=- other code omitted here -=-=-

// Confirmation Dialog
const confirmDelete = function (id) {
  confirm.require({
    message: 'Are you sure you want to delete this user?',
    header: 'Delete User',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    // use a lambda here
    accept: () => {
      deleteUser(id)
    },
  })
}
</script>
```

{{% /notice %}}