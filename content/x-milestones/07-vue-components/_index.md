---
title: "Vue.js Components"
pre: "7. "
weight: 70
---

This set of milestones is all about building a RESTful API and interface for the [Lost Kansas Communities](https://lostkansas.ccrsdigitalprojects.com/) project. 

## Milestone 6 - Vue.js CRUD App

Building from the [previous milestone](../06-vue-crud-app/), expand upon the starter project by adding the following features:

1. Metadata view


2. Fix bugs
* Files are not protected - write custom handler to only allow access to uploaded files if permission allows
* Communities & Metadata overly secure - allow owner to edit communities and/or metadata even if not have role
* Update endpoint for creating communities and metadata to assign owner automatically
* Properly handle deleting uploaded files when document is deleted; also delete uploaded files when overwritten

