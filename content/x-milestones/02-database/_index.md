---
title: "Add a Database"
pre: "2. "
weight: 20
---

This set of milestones is all about building a RESTful API and interface for the [Lost Kansas Communities](https://lostkansas.ccrsdigitalprojects.com/) project. 

## Milestone 2 - Add a Database

Building from the [previous milestone](../01-starter/), expand upon the starter project by adding the following features:

1. Create an SQLite database
2. Install and configure the Sequelize ORM and the Umzug migration tool
3. Configure an automated process to migrate and seed the data on application startup
4. Create database migrations, seeds, and models matching the database diagram given below

### Database Diagram

![Database Diagram](images/milestones/02/lost_communities.png)

### Seed Data

Seed data is stored in CSV files that can be downloaded from Canvas. See [Seeding from a CSV File](../../x-examples/02-database/07-another-table.md#seed) for an example of how to read data from a CSV file when seeding the database.