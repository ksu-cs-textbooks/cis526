---
title: "Reusing Components"
pre: "2. "
weight: 20
---

{{< youtube id >}}

## Reusing Components

One of the many amazing features of a front-end framework such as Vue is the ability to reuse components in very powerful ways. For example, right now our application uses an entirely separate view and component to handle editing and updating users, but that means that we have to constantly jump back and forth between two views when working with users. Now that those views are using a shared Pinia store, we can use a [PrimeVue DynamicDialog](https://primevue.org/dynamicdialog/) component to allow us to open the `UserEdit` component in a popup dialog on our `UsersList` component. 

## Installing DynamicDialog

To begin, we must install the service for this component in our `src/main.js` along with the other services for PrimeVue components:

```js {title="src/main.js" hl_lines="14 35"}
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
import DialogService from 'primevue/dialogservice';

// -=-=- other code omitted here -=-=-

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
app.use(DialogService)

// -=-=- other code omitted here -=-=-
```

Then, we can add the single instance of the component to our top-level `App.vue` component along with the other service components:

```vue {title="src/App.vue" hl_lines="10 33"}
<script setup>
/**
 * @file Main Vue Application
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Components
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import DynamicDialog from 'primevue/dynamicdialog'
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
  <DynamicDialog />
</template>
```

That's all it takes to make this feature available throughout our application.

## Updating UsersList to use DynamicDialog

Now, in our `UsersList` component, we simply have to add a few imports as well as function to load the component in a dialog box:

```vue {title="src/components/users/UsersList.vue" hl_lines="4 18-20 24-37"}
// -=-=- other code omitted here -=-=-

// Import Libraries
import { ref, defineAsyncComponent } from 'vue'
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
const confirm = useConfirm()
import { useDialog } from 'primevue/usedialog';
const dialog = useDialog();
const userEditComponent = defineAsyncComponent(() => import('./UserEdit.vue'));

// -=-=- other code omitted here -=-=-

// Load Dialog
const editDialog = function (id) {
  dialog.open(userEditComponent, {
    props: {
      style: {
          width: '40vw',
      },
      modal: true
    },
    data: {
      id: id
    }
  });
}
</script>
```

Notice in the `dialog.open` function call, we are including the `userEditComponent` that we are loading asynchronously in the background using the `defineAsyncComponent` function in Vue. This allows us to load the main `UsersList` component fully first, and then in the background it will load the `UserEdit` component as needed. We are also passing along the `id` of the user to be edited as part of the `data` that is sent to the component. 

Finally, in the template, we just replace the click handlers for the **New** and **Edit** buttons to call this new `editDialog` function:

```vue {title="src/components/users/UsersList.vue" hl_lines="16 33"}
<template>
  <DataTable
    :value="users"
    v-model:filters="filters"
    :globalFilterFields="['username']"
    filterDisplay="menu"
    sortField="username"
    :sortOrder="1"
  >
    <template #header>
      <div class="flex justify-between">
        <Button
          label="New User"
          icon="pi pi-user-plus"
          severity="success"
          @click="editDialog()"
        />

        <!-- other code omitted here -->

      </div>
    </template>

    <!-- other code omitted here -->

    <Column header="Actions" style="min-width: 8rem">
      <template #body="slotProps">
        <div class="flex gap-2">
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            @click="editDialog(slotProps.data.id)"
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

Now, when we click those buttons, it will open the `EditUser` component in a modal popup dialog instead of directing users to a new route. Of course, on some pages, we may need to check that the user has specific roles before allowing the user to actually load the popup, just like we have to check for those roles before the user navigates to those routes. Since we are now bypassing the Vue Router, any logic in the router may need to be recreated here.

## Updating UserEdit Component 

Finally, we must make a few minor tweaks to the `UserEdit` component so that it can run seamlessly in both a stand-alone view as well as part of a popup dialog. The major change comes in the way the incoming data is received, and what should happen when the user is successfully saved.

The PrimeVue DynamicDialog service uses Vue's [Provide / Inject](https://vuejs.org/guide/components/provide-inject) interface to send data to the component loaded in a dialog. So, in our component, we must declare a few additional state variables, as well as small piece of code to detect whether it is running in a dialog or as a standalone component in a view.

```vue {title="src/components/users/UserEdit.vue" hl_lines="6-7 9-19"}
<script setup>
// -=-=- other code omitted here -=-=-

// Declare State
const errors = ref([])
const isDialog = ref(false)
const userId = ref()

// Detect Dialog
const dialogRef = inject('dialogRef')

if(dialogRef && dialogRef.value.data) {
  // running in a dialog
  isDialog.value = true
  userId.value = dialogRef.value.data.id
} else {
  // running in a view
  userId.value = props.id
}

// -=-=- other code omitted here -=-=-
</script>
```

For this component, we have created a new `isDialog` reactive state variable that will be set to `true` if the component detects it has been loaded in a dynamic dialog. It does this by checking for the status of the `dialogRef` injected state variable. We are also now storing the ID of the user to be edited in a new `userId` reactive state variable instead of relying on the `props.id` variable, which will not be present when the component is loaded in a dialog.

So, we simply need to replace all references to `props.id` to use `userId` instead. We can also change the action that occurs when the user is successfully saved - if the component is running in a dialog, it should simply close the dialog instead of using the router to navigate back to the previous page. 

```vue {title="src/components/users/UserEdit.vue" hl_lines="6 15 24 42-49"}
<script setup>
// -=-=- other code omitted here -=-=-

// Find Single User
const user = computed(() => {
  return users.value.find((u) => u.id == userId.value) || { username: '', roles: [] }
})

// -=-=- other code omitted here -=-=-

// Save User
const save = function () {
  errors.value = []
  userStore
    .saveUser(userId.value, user)
    .then(function (response) {
      if (response.status === 201) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: response.data.message,
          life: 5000,
        })
        leave()
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

// Leave Component
const leave = function() {
  if (isDialog.value) {
    dialogRef.value.close()
  } else {
    router.push({ name: 'users' })
  }
}
</script>
```

Finally, we can make a minor update to the template to also use the `userId` value instead of `props.id`

```vue {title="src/components/users/UserEdit.vue" hl_lines="3 7"}
<template>
  <div class="flex flex-col gap-3 max-w-xl justify-items-center">
    <h1 class="text-xl text-center m-1">{{ userId ? 'Edit User' : 'New User' }}</h1>

    <!-- other code omitted here -->

    <Button severity="secondary" @click="leave" label="Cancel" />
  </div>
</template>
```

That's all it takes! Now, when we click the **New User** or **Edit User** buttons on our `UsersList` component, we'll see a pop-up dialog that contains our `UserEdit` component instead of being taken to an entirely new page.

![DynamicDialog](/images/examples/07/dynamicdialog.gif)

## A Bug! Reactive State Across Components

A very keen eye may notice a bug in the implementation of this component already - what if the user changes a value but then clicks the **Cancel** button on the modal dialog? Let's see what that looks like:

![DynamicDialogBug](/images/examples/07/dynamicdialogbug.gif)

As we can see, the edits made in the `UserEdit` dialog are immediately reflected in the contents of the `UsersList` component as well. This is because they are both using the same Pinia store and referencing the same list of users in both components. So, this can present all sorts of strange issues in our program.

There are at least a couple of different ways we can go about fixing this:

1) When the dialog closes, we can call `userStore.hydrate()` from the `UsersList` component to ensure that it has the latest version of the data from the server. However, if we do this, we could end up calling it twice when a user is saved, since the `User` store already does this.
2) In our `EditUser` component, we can make sure we are editing a deep copy of our user, and not the same user reference as the one in our Pinia store.

Let's implement the second solution. Thankfully, it is as simple as using `JSON.parse` and `JSON.stringify` to create a quick deep copy of the user we are editing. We can do this in our computed Vue state variable in that component:

```vue {title="src/components/users/UserEdit.vue" hl_lines="5-7"}
// -=-=- other code omitted here -=-=-

// Find Single User
const user = computed(() => {
  return JSON.parse(
    JSON.stringify(users.value.find((u) => u.id == userId.value) || { username: '', roles: [] }),
  )
})

// -=-=- other code omitted here -=-=-
```

With that change in place, we no longer see the bug in our output:

![DynamicDialog Fixed](/images/examples/07/dynamicdialogfixed.gif)