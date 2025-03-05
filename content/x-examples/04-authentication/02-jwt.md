---
title: "JSON Web Token"
pre: "2. "
weight: 20
---

{{< youtube id >}}

## JSON Web Tokens (JWT)

Now that we have a working authentication system, the next step is to configure our authentication response to include a valid JSON Web Token, or JWT, that contains information about the authenticated user. We've already learned a bit about JWTs in this course, so we won't cover too many of the details here.

To work with JWTs, we'll need to install the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) package from NPM:

```bash {title="terminal"}
$ npm install jsonwebtoken
```

Next, we'll need to create a secret key that we can use to sign our tokens. We'll add this as the `JWT_SECRET_KEY` setting in our `.env`, `.env.test` and `.env.example` files.

There are many ways to generate a secret key, but one of the simplest is to just use the built in functions in Node.js itself. We can launch the Node.js [REPL](https://nodejs.org/en/learn/command-line/how-to-use-the-nodejs-repl) environment by just running the `node` command in the terminal:

```bash {title="terminal"}
$ node
```

From there, we can use this line to get a random secret key:

```js {title="node"}
> require('crypto').randomBytes(64).toString('hex')
```

{{% notice info "Documenting Terminal Commands" %}}

Just like we use `$` as the prompt for Linux terminal commands, the Node.js REPL environment uses `>` so we will include that in our documentation. You should not include that character in your command.

{{% /notice %}}

If done correctly, we'll get a random string that you can use as your secret key!

![Disabled Authentication](/images/examples/04/auth_3.png)

We can include that key in our `.env` file. To help remember how to do this in the future, we can even include the Node.js command as a comment above that line:

```env {title=".env"}
# -=-=- other settings omitted here -=-=-
# require('crypto').randomBytes(64).toString('hex')
JWT_SECRET_KEY='46a5fdfe16fa710867102d1f0dbd2329f2eae69be3ed56ca084d9e0ad....'
```

Once we have the library and a key, we can easily sign our JWT by updating the content of our `sendSuccess` method in the `routes/auth.js` file:

```js {title="routes/auth.js"}
// -=-=- other code omitted here -=-=-

// Import libraries
import express from "express";
import passport from "passport";
import jsonwebtoken from "jsonwebtoken"

// -=-=- other code omitted here -=-=-
const authSuccess = function (req, res, next) {
  const token = jsonwebtoken.sign(
    // Hack to convert Sequelize object to plain JavaScript object
    JSON.parse(JSON.stringify(req.user)),
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '6h'
    }
  )
  res.json({
    token: token
  })
};
```

Now, when we visit the `/auth/bypass?token=admin` URL on our working website, we should receive a JWT as a response:

![JWT Response](/images/examples/04/auth_4.png)

Of course, while that data may seem unreadable, we already know that JWTs are Base64 encoded, so we can easily view the content of the token. Thankfully, there are many great tools we can use to debug our tokens, such as [Token.dev](https://token.dev/), to confirm that they are working correctly.

![JWT Debugger](/images/examples/04/auth_5.png)

{{% notice warning "Do Not Share Live Keys!" %}}

While sites like this will also help you confirm that your JWTs are properly signed by asking for your secret key, you **SHOULD NOT** share a secret key for a live production application with these sites. There is always a chance it has been compromised!

{{% /notice %}}

## Sending JWT in a Cookie

To fully implement our authentication strategy, we want to send this JWT as both a cookie for the user to provide with future web requests, and also as an authorization header to API requests. So, let's modify our `authSuccess` method to send that JWT as a cookie, then redirect the user back to the index page:

```js {title="routes/auth.js"}
// -=-=- other code omitted here -=-=-
const authSuccess = function (req, res, next) {
  const token = jsonwebtoken.sign(
    // Hack to convert Sequelize object to plain JavaScript object
    JSON.parse(JSON.stringify(req.user)),
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '6h'
    }
  )
  
  // send JWt as cookie
  res.cookie(
    'jwt',
    token,
    {
      httpOnly: true,
      sameSite: true,
      secure: true
    }
  )
  res.redirect("/");
};
```

Now, when we navigate to our `/auth/bypass?token=admin` URL, we should immediately be redirected back to our index page if everything is working correctly. However, this time it should also set a `jwt` cookie, which we can see in the developer tools of our web browser:

![JWT Debugger](/images/examples/04/auth_6.png)

## Exchanging a Cookie for a JWT



There we go! Now we have a working JSON Web Token in our application! Next, we'll discuss how to use that in an overall authentication strategy. 