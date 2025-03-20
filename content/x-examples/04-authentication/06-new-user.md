---
title: "New Users"
pre: "6. "
weight: 60
---

{{< youtube id >}}

## Handling New Users

What if a user logs in to our application through CAS, but we don't have them in our database of users? Do we want to deny them access to the application? Or should we somehow gracefully add them to the list of users and give them some basic access to our application? 

Since we are building a website meant to be open to a number of users, let's go ahead and implement a strategy where a new user can be created in the event that a user logs on through one of our authentication strategies but isn't found in the database.

Thankfully, to do this is really simple - all we must do is add a few additional lines to our `authenticateUser` function in the `configs/auth.js` file:

```js {title="configs/auth.js" hl_lines="17-34"}
// -=-=- other code omitted here -=-=-
const authenticateUser = function(username, next) {
  // Find user with the username
  User.findOne({ 
    attributes: ["id", "username"],
    include: {
      model: Role,
      as: "roles",
      attributes: ["id", "role"],
      through: {
        attributes: [],
      },
    },
    where: { username: username },
  })
  .then((user) => {
    // User not found
    if (user === null) {
      // Create new user
      User.create({ username: username}).then((user) => {
        logger.debug("New user created via login: " + user.username);
        
        // Convert Sequelize object to plain JavaScript object
        user = JSON.parse(JSON.stringify(user))
        return next(null, user);
      })
    } else {
      // User authenticated
      logger.debug("Login succeeded for user: " + user.username);
      
      // Convert Sequelize object to plain JavaScript object
      user = JSON.parse(JSON.stringify(user))
      return next(null, user);
    }
  });
}

// -=-=- other code omitted here -=-=-
```

Now, when we try to log in using any username, we'll either be logged in as an existing user, or a new user will be created. We can see this in our log output:

``` {title="output"}
[2025-03-20 07:15:17.256 PM] http:      GET /auth/cas 302 0.697 ms - 0
[2025-03-20 07:15:23.525 PM] debug:     New user created via login: russfeld
[2025-03-20 07:15:23.564 PM] http:      GET /auth/cas?ticket=aac12881-9bea-449c-bf13-b981525cc8db 302 218.923 ms - 30
[2025-03-20 07:15:23.721 PM] http:      GET / 200 1.299 ms - -
```

That's all there is to it! Of course, we can also configure this process to automatically assign roles to our newly created user, but for right now we won't worry about that. 