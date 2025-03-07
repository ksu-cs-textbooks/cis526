---
title: "JSON Web Token"
pre: "3. "
weight: 30
---

{{< youtube id >}}

## JSON Web Tokens (JWT)

Now that we have a working authentication system, the next step is to configure a method to request a valid JSON Web Token, or JWT, that contains information about the authenticated user. We've already learned a bit about JWTs in this course, so we won't cover too many of the details here.

To work with JWTs, we'll need to install the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) package from NPM:

```bash {title="terminal"}
$ npm install jsonwebtoken
```

Next, we'll need to create a secret key that we can use to sign our tokens. We'll add this as the `JWT_SECRET_KEY` setting in our `.env`, `.env.test` and `.env.example` files. We can use the same method discussed on the previous page to generate a new random key:

```env {title=".env"}
# -=-=- other settings omitted here -=-=-
# require('crypto').randomBytes(64).toString('hex')
JWT_SECRET_KEY='46a5fdfe16fa710867102d1f0dbd2329f2eae69be3ed56ca084d9e0ad....'
```

Once we have the library and a key, we can easily create and sign a JWT in the `/auth/token` route in the `routes/auth.js` file:

```js {title="routes/auth.js"}
// -=-=- other code omitted here -=-=-

// Import libraries
import express from "express";
import passport from "passport";
import jsonwebtoken from "jsonwebtoken"

// -=-=- other code omitted here -=-=-
router.get("/token", function (req, res, next) {
  // If user is logged in
  if (req.user) {
    const token = jsonwebtoken.sign(
      req.user,
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '6h'
      }
    )
    res.json({
      token: token
    })
  } else {
    // Send unauthorized response
    res.status(401).send()
  }
});
```

Now, when we visit the `/auth/token` URL on our working website (after logging in through the `/auth/bypass` route), we should receive a JWT as a response:

![JWT Response](/images/examples/04/auth_4.png)

Of course, while that data may seem unreadable, we already know that JWTs are Base64 encoded, so we can easily view the content of the token. Thankfully, there are many great tools we can use to debug our tokens, such as [Token.dev](https://token.dev/), to confirm that they are working correctly.

![JWT Debugger](/images/examples/04/auth_5.png)

{{% notice warning "Do Not Share Live Keys!" %}}

While sites like this will also help you confirm that your JWTs are properly signed by asking for your secret key, you **SHOULD NOT** share a secret key for a live production application with these sites. There is always a chance it has been compromised!

{{% /notice %}}

