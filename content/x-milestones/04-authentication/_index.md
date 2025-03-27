---
title: "Authentication"
pre: "4. "
weight: 40
---

This set of milestones is all about building a RESTful API and interface for the [Lost Kansas Communities](https://lostkansas.ccrsdigitalprojects.com/) project. 

## Milestone 4 - Authentication

Building from the [previous milestone](../03-rest-api/), expand upon the starter project by adding the following features:

1. Implement Bypass authentication using the [Unique Token Strategy](https://www.passportjs.org/packages/passport-unique-token/) in Passport.js as shown in the tutorial. When enabled via the `.env` file, it should allow authentication via the `/auth/bypass?token=<username>` route.
2. Allow the system to create new users if a user tries to authenticate with a username not currently in the database. That user should not be assigned any roles by default.
3. Implement [CAS](https://github.com/alt-cs-lab/passport-cas) authentication strategy in Passport.js as shown in the tutorial. Users should be able to authenticate via the `https://testcas.cs.ksu.edu` server. CAS settings should be controlled via the `.env` file.
4. Implement [JSON Web Tokens](https://www.npmjs.com/package/jsonwebtoken) via the `/auth/token` route as shown in the tutorial. The token should include the user's ID and a list of roles assigned to the user.
5. Require a valid JWT to access ALL routes under the `/api/v1` path. 
6. Implement role-based authorization for ALL routes under the `/api/v1` path. See below for a matrix of roles and allowed actions.
7. Update unit tests for each route to use authentication and also to test role-based authorization as shown in the tutorial.

### Authorization Matrix

* Path: `/api/v1/users`
  * ALL ACTIONS: `manage_users`
* Path: `/api/v1/roles`
  * GET: `manage_users`
* Path: `/api/v1/communities`
  * GET: [`view_communities`, `manage_communities`, `add_communities`]
  * POST: [`manage_communities`, `add_communities`]
  * PUT: [`manage_communities`]
  * DELETE: [`manage_communities`]
* Path: `/api/v1/counties`
  * GET: [`view_communities`, `manage_communities`, `add_communities`]
* Path: `/api/v1/documents`
  * GET: [`view_documents`, `manage_documents`, `add_documents`]
  * POST: [`manage_documents`, `add_documents`] (including file uploads)
  * PUT: [`manage_documents`]
  * DELETE: [`manage_documents`]
* Path: `/api/v1/metadata`
  * GET: [`view_documents`, `manage_documents`, `add_documents`]
  * POST: [`manage_documents`, `add_documents`] (including adding and removing communities and documents to metadata)
  * PUT: [`manage_documents`]
  * DELETE: [`manage_documents`]

### Database Diagram

![Database Diagram](images/milestones/02/lost_communities.png)

### Open API Specification

**UPDATED FOR MILESTONE 4**

{{% notice tip %}}

You can download this specification file by clicking the link below, and then edit the `servers` section to test it using your server. You can use the [Open API Editor](https://editor.swagger.io/) to see a cleaner view of this JSON file.

The OpenAPI specification looks best using the light theme. You can adjust the textbook theme in the left sidebar at the bottom of the textbook page.

{{% /notice %}}

{{< openapi src="/cis526/milestones/04/openapi.json" >}}