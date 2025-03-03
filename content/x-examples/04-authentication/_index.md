---
title: "Authentication"
pre: "4. "
weight: 40
---

This example project builds on the previous RESTful API project by adding user authentication. This will ensure users are identified within the system and are only able to perform operations according to the roles assigned to their user accounts.

## Project Deliverables

At the end of this example, we will have a project with the following features:

1. An authentication system using [Passport.js](https://www.passportjs.org/) and [CAS](https://apereo.github.io/cas/7.1.x/index.html)
2. Valid JavaScript Web Tokens (JWTs) for authentication within the RESTful API
3. Proper middleware to verify users have the correct role for each operation in the API

{{% notice warning "Prior Work" %}}

This project picks up right where the last one left off, so if you haven't completed that one yet, go back and do that before starting this one.

{{% /notice %}}

Let's get started!