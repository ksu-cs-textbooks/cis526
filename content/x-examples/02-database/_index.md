---
title: "Adding a Database"
pre: "2. "
weight: 20
---

This example project builds on the previous Express Starter Project by adding a database. A database is a powerful way to store and retrieve the data used by our web application. 

To accomplish this, we'll learn about different libraries that interface between our application and a database. Once we've installed a library, we'll discover how to use that library to create database tables, add initial data to those tables, and then easily access them within our application.

## Project Deliverables

At the end of this example, we will have a project with the following features:

1. An SQLite database
2. The Sequelize ORM tool
3. The Umzug migration tool
4. A simple migration to create tables for Users and Roles
5. Seed data for those tables
6. Automated processes to migrate and seed the data on application startup
7. A simple route to query user information


{{% notice warning "Prior Work" %}}

This project picks up right where the last one left off, so if you haven't completed that one yet, go back and do that before starting this one.

{{% /notice %}}

Let's get started!