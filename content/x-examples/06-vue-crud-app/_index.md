---
title: "Vue.js CRUD App"
pre: "6. "
weight: 60
---

This example project builds on the previous Vue.js starter project by scaffolding a CRUD frontend for the basic users and roles tables.

## Project Deliverables

At the end of this example, we will have a project with the following features:

1. Most menu items and routes are protected and only allow users with specific roles to view/access them
2. A page that lists all roles in the application for anyone with the `manage_users` role. Roles are not editable.
3. A page that lists all users in a data table for anyone with the `manage_users` role. 
   1. Helpful Columns on that page should be searchable and sortable, as well as the ability to filter by role
   2. A page to edit existing users, including updating their roles
   3. A page to create new users and assign new roles
   4. A method to delete existing users

{{% notice warning "Prior Work" %}}

This project picks up right where the last one left off, so if you haven't completed that one yet, go back and do that before starting this one.

{{% /notice %}}

Let's get started!