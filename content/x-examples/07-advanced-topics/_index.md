---
title: "Advanced Topics"
pre: "7. "
weight: 70
---

This example project builds on the previous Vue.js CRUD app by discussing some more advanced topics related to web application development.

## Project Deliverables

At the end of this example, we will have a project with the following features:

1. A Pinia store that handles storing users and roles, and all Vue components adapted to use that Pinia store
2. A DynamicDialog for editing and creating users, which repurposes the UserEdit component
3. A working Dockerfile for the project
4. A working GitHub Action to build the Docker image and release it on GitHub
5. A working Docker Compose file to deploy the application
6. The application is adapted to optionally use Postgres instead of SQLite as the database engine

{{% notice warning "Prior Work" %}}

This project picks up right where the last one left off, so if you haven't completed that one yet, go back and do that before starting this one.

{{% /notice %}}

Let's get started!