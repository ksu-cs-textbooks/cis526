---
title: "Users Table"
pre: "2. "
weight: 20
---

{{< youtube id >}}

## Users Table

Now that we have explored the basics of adding new menu items and routes to our application, let's start working on the components to view and edit the users available in our application. To begin, we'll work on the **GET ALL* route, which will allow us to view all of the users on our system. For this, we'll use the [PrimeVue DataTable](https://primevue.org/datatable/) component, which is one of the most powerful components available in the PrimeVue library.

First, before we can do that, we must set up our new view and a route to get there, as well as a menu option. So, let's go through that really quickly.

First, we'll add a new route to the Vue router:

```js {title="src/router/index.js" hl_lines="10-15"}
// -=-=- other code omitted here -=-=-

const router = createRouter({
  // Configure History Mode
  history: createWebHistory(import.meta.env.BASE_URL),

  // Configure routes
  routes: [
    // -=-=- other code omitted here -=-=-
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersListView.vue'),
      beforeEnter: requireRoles("manage_users")
    }
  ],
})

// -=-=- other code omitted here -=-=-
```

We'll also add that route as a menu item in our `TopMenu.vue` component:

```vue {title="src/components/layout/TopMenu.vue"}
<script setup>
// -=-=- other code omitted here -=-=-

// Declare State
const items = ref([
  // -=-=- other code omitted here -=-=-
  {
    label: 'Users',
    icon: 'pi pi-users',
    command: () => {
      router.push({ name: 'users' })
    },
    roles: ['manage_users']
  },
])

// -=-=- other code omitted here -=-=-
</script>
```

Then, we'll create a new view named `UsersListView.vue` that will contain our table component:

```vue {title="src/views/UsersListView.vue"}
<script setup>
import UsersList from '../components/users/UsersList.vue'
</script>

<template>
  <UsersList />
</template>
```

Finally, we'll create a new `UsersList` component to store our code:

```vue {title="src/components/users/UsersList.vue"}
<script setup>
/**
 * @file Users List Component
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

</script>

<template>
  Users List Here
</template>
```

With all of that in place, we should now be able to click on the **Users** button at the top of our page and get to the `UsersList` component on the appropriate view:

![Users Table](/images/examples/06/vue_crud_2.png)

From here, we can start to build our table view.

## PrimeVue DataTable

To use the [PrimeVue DataTable](https://primevue.org/datatable/) component, we first need to get our data from the API so we can easily display it in our component. So, let's use the Axios api instance to query the API and get our list of users. This is nearly the exact same code we used previously to get the list of users:

```vue {title="src/components/users/UsersList.vue" hl_lines="7-22"}
<script setup>
/**
 * @file Users List Component
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref } from 'vue'
import { api } from '@/configs/api'

// Create Reactive State
const users = ref([])

// Load Users
api
  .get('/api/v1/users')
  .then(function (response) {
    users.value = response.data
  })
  .catch(function (error) {
    console.log(error)
  })

</script>
```

Now that we have that list, we can start to construct our DataTable. First, we'll need to import the required components in our `<script setup>` section:

```vue {title="src/components/users/UsersList.vue" hl_lines="10-11"}
<script setup>
/**
 * @file Users List Component
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref } from 'vue'
import { api } from '@/configs/api'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

// -=-=- other code omitted here -=-=-
</script>
```

Now, in the `<template>` section, we can build a basic DataTable by including the data we want to view and the columns that should be included:

```vue {title="src/components/users/UsersList.vue"}
<template>
  <DataTable :value="users">
    <Column field="username" header="Username" />
    <Column field="roles" header="Roles" />
    <Column field="createdAt" header="Created" />
    <Column field="updatedAt" header="Updated" />
  </DataTable>
</template>
```

Each `<Column>` component includes a field name for that column, as well as a header value. With that in place, we should see a simple page with lots of helpful information about our users:

![Users Table with Columns](/images/examples/06/vue_crud_3.png)

This is a great start, but we can clean this up to make it much easier for our users to read and digest the information. 

## Custom Column Templates

First, let's create a couple of custom templates for columns. First, we notice that the **Roles** column is just outputting the entire JSON list of roles, but this is not very helpful. So, let's modify that column to present a list of [Chips](https://primevue.org/chip/) representing the roles:

```vue {title="src/components/users/UsersList.vue" hl_lines="12 20-26"}
<script setup>
/**
 * @file Users List Component
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref } from 'vue'
import { api } from '@/configs/api'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chip from 'primevue/chip';

// -=-=- other code omitted here -=-=-
</script>

<template>
  <DataTable :value="users">
    <Column field="username" header="Username" />
    <Column field="roles" header="Roles">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Chip v-for="role in data.roles" :key="role.id" :label="role.role"  />
        </div>
      </template>
    </Column>
    <Column field="createdAt" header="Created" />
    <Column field="updatedAt" header="Updated" />
  </DataTable>
</template>
```

Inside of the `<Column>` component, we place a `<template>` for the `#body` slot, and we also provide a link to the `data` of the `<Column>` component so we can access that data. 

With this change, our table now looks like this:

![Users Table with Chips for Roles](/images/examples/06/vue_crud_4.png)

However, we can improve on that a bit by adding some additional information to our application that helps us display these roles in a bit cleaner format. Let's create a new custom `RoleChip` component that will display the roles properly, along with some additional information. 

```vue {title="src/components/roles/RoleChip.vue"}
<script setup>
/**
 * @file Roles Chip
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import Chip from 'primevue/chip';

// Incoming Props
const props = defineProps({
  // Role Object
  role: Object
})

// Lookup Table
const roles = {
  1: {
    name: "Manage Users",
    icon: "pi pi-user-edit"
  },
  2: {
    name: "Manage Documents",
    icon: "pi pi-pen-to-square"
  },
  3: {
    name: "Add Documents",
    icon: "pi pi-file-plus"
  },
  4: {
    name: "Manage Communities",
    icon: "pi pi-pencil"
  },
  5: {
    name: "Add Communities",
    icon: "pi pi-plus-circle"
  },
  6: {
    name: "View Documents",
    icon: "pi pi-file"
  },
  7: {
    name: "View Communities",
    icon: "pi pi-building-columns"
  }
}
</script>

<template>
  <Chip :label="roles[props.role.id].name" :icon="roles[props.role.id].icon" />
</template>
```

This component includes a constant lookup table that provides some additional information about each role, based on the role's ID. This allows us to assign a user-friendly name and icon to each role in our frontend application. In fact, if we are internationalizing this application, we could also use this component to translate the role names into localized forms here. 

We can update our `UsersList.vue` component to use this new `RoleChip` component very easily:

```vue {title="src/components/users/UsersList.vue" hl_lines="12 23"}
<script setup>
/**
 * @file Users List Component
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref } from 'vue'
import { api } from '@/configs/api'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import RoleChip from '../roles/RoleChip.vue';

// -=-=- other code omitted here -=-=-
</script>

<template>
  <DataTable :value="users">
    <Column field="username" header="Username" />
    <Column field="roles" header="Roles">
      <template #body="{ data }">
        <div class="flex gap-2">
          <RoleChip v-for="role in data.roles" :key="role.id" :role="role"  />
        </div>
      </template>
    </Column>
    <Column field="createdAt" header="Created" />
    <Column field="updatedAt" header="Updated" />
  </DataTable>
</template>
```

Now we have a much cleaner view of the roles each user is assigned, with helpful icons to help us remember what each one does.

![Users Table with RoleChips](/images/examples/06/vue_crud_5.png)

## Handling Dates

Let's also clean up the **Created** and **Updated** columns by rendering the dates into a more useful format. For this, we can use the [date-fns](https://date-fns.org/) library to help us format and display times easily in our project. First, we'll need to install it:

```bash {title="terminal"}
$ npm install date-fns
```

Then, in our component, we can use it to format our dates by computing the distance in the past that the event occurred:

```vue {title="src/components/users/UsersList.vue" hl_lines="10 28-41"}
<script setup>
/**
 * @file Users List Component
 * @author Russell Feldhausen <russfeld@ksu.edu>
 */

// Import Libraries
import { ref } from 'vue'
import { api } from '@/configs/api'
import { formatDistance } from 'date-fns';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import RoleChip from '../roles/RoleChip.vue';

// -=-=- other code omitted here -=-=-
</script>

<template>
  <DataTable :value="users">
    <Column field="username" header="Username" />
    <Column field="roles" header="Roles">
      <template #body="{ data }">
        <div class="flex gap-2">
          <RoleChip v-for="role in data.roles" :key="role.id" :role="role"  />
        </div>
      </template>
    </Column>
    <Column field="createdAt" header="Created">
      <template #body="{ data }">
        <span v-tooltip.bottom="new Date(data.createdAt).toLocaleString()">
          {{ formatDistance(new Date(data.createdAt), new Date(), { addSuffix: true }) }}
        </span>
      </template>
    </Column>
    <Column field="updatedAt" header="Created">
      <template #body="{ data }">
        <span v-tooltip.bottom="new Date(data.updatedAt).toLocaleString()">
          {{ formatDistance(new Date(data.updatedAt), new Date(), { addSuffix: true }) }}
        </span>
      </template>
    </Column>
  </DataTable>
</template>
```

With that in place, we can more easily see how long ago each user's account was created or updated:

![Users Table with Times](/images/examples/06/vue_crud_6.png)

We can even hover over one of the formatted dates to see the actual date in a tooltip.

## Sorting

## Searching

## Buttons


