---
title: "RESTful API"
pre: "3. "
weight: 30
---

This set of milestones is all about building a RESTful API and interface for the [Lost Kansas Communities](https://lostkansas.ccrsdigitalprojects.com/) project. 

## Milestone 3 - RESTful API

Building from the [previous milestone](../02-database/), expand upon the starter project by adding the following features:

1. Build a full RESTful API to manage the communities, counties, metadata, and documents. The RESTful API should faithfully implement the Open API specification given below.
    1. Notice that the `/api/v1/documents/{id}/upload` API path handles file uploads! We haven't covered that in these examples, but there are some prior examples in this class to build upon.
    2. Pay special attention to the example inputs and outputs for each route. Your JSON should **exactly** match the structure of those examples. Note that some fields may be hidden in associated objects that are included. 
2. Each API endpoint should include full unit tests, with an explicit goal to test both successful and unsuccessful operations performed by that endpoint.
3. All functions, files, and exported objects should be documented using JSDoc and Open API following the examples given.

### Database Diagram

![Database Diagram](images/milestones/02/lost_communities.png)

### Open API Specification

{{% notice tip %}}

You can download this specification file by clicking the link below, and then edit the `servers` section to test it using your server. You can use the [Open API Editor](https://editor.swagger.io/) to see a cleaner view of this JSON file.

The OpenAPI specification looks best using the light theme. You can adjust the textbook theme in the left sidebar at the bottom of the textbook page.

{{% /notice %}}

{{< openapi src="/cis526/milestones/03/openapi.json" >}}