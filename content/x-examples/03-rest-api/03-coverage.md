---
title: "Code Coverage"
pre: "3. "
weight: 30
---

{{< youtube 2Yl9zF6iz-U >}}

## Code Coverage

It is often helpful to examine the [code coverage](https://en.wikipedia.org/wiki/Code_coverage) of our unit tests. Thankfully, there is an easy way to enable that in our project using the [c8](https://www.npmjs.com/package/c8) library. So, we can start by installing it:

```bash {title="terminal"}
$ npm install --save-dev c8
```

Once it is installed, we can simply add it to a new script in the `package.json` file that will run our tests with code coverage:

```json {title="package.json" hl_lines="9"}
{
  ...
  "scripts": {
    "start": "LOG_LEVEL=http node ./bin/www",
    "dev": "nodemon ./bin/www",
    "lint": "npx eslint --fix .",
    "format": "npx prettier . --write",
    "test": "mocha --require test/hooks.js --recursive --parallel --timeout 2000 --exit",
    "cov": "c8 --reporter=html --reporter=text mocha --require test/hooks.js --recursive --parallel --timeout 2000 --exit"
  },
  ...
}
```

All we have to do is add the `c8` command with a few options in front of our existing `mocha` command.

Now, we can run our tests with code coverage using this script:

```bash {title="terminal"}
$ npm run cov
```

This time, we'll see a bunch of additional output on the terminal

``` {title="output"}
> lost-communities-solution@0.0.1 cov
> c8 --reporter=html --reporter=text mocha --require test/hooks.js --recursive --parallel --timeout 2000 --exit

[dotenvx@1.34.0] injecting env (6) from .env.test

[dotenvx@1.34.0] injecting env (0) from .env.test
[dotenvx@1.34.0] injecting env (0) from .env

  /api
    GET /
      ✔ should list all API versions


  1 passing (1s)

------------------------|---------|----------|---------|---------|-------------------------------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                         
------------------------|---------|----------|---------|---------|-------------------------------------------
All files               |   93.53 |    83.33 |   55.55 |   93.53 |                                           
 server                 |   88.52 |       50 |     100 |   88.52 |                                           
  app.js                |   88.52 |       50 |     100 |   88.52 | 53-59                                     
 server/configs         |   91.86 |    47.36 |     100 |   91.86 |                                           
  database.js           |     100 |      100 |     100 |     100 |                                           
  logger.js             |   85.56 |    30.76 |     100 |   85.56 | 24-25,27-28,30-31,33-34,36-37,39-40,42-43 
  migrations.js         |     100 |      100 |     100 |     100 |                                           
  openapi.js            |   92.85 |    66.66 |     100 |   92.85 | 19-21                                     
  seeds.js              |     100 |      100 |     100 |     100 |                                           
 server/middlewares     |     100 |      100 |     100 |     100 |                                           
  request-logger.js     |     100 |      100 |     100 |     100 |                                           
 server/migrations      |   96.07 |      100 |      50 |   96.07 |                                           
  00_users.js           |   95.55 |      100 |      50 |   95.55 | 44-45                                     
  01_roles.js           |   94.91 |      100 |      50 |   94.91 | 57-59                                     
  02_counties.js        |   96.61 |      100 |      50 |   96.61 | 58-59                                     
  03_communities.js     |   96.61 |      100 |      50 |   96.61 | 58-59                                     
  04_metadata.js        |   96.66 |      100 |      50 |   96.66 | 88-90                                     
  05_documents.js       |   95.71 |      100 |      50 |   95.71 | 68-70                                     
 server/models          |     100 |      100 |     100 |     100 |                                           
  community.js          |     100 |      100 |     100 |     100 |                                           
  county.js             |     100 |      100 |     100 |     100 |                                           
  document.js           |     100 |      100 |     100 |     100 |                                           
  metadata.js           |     100 |      100 |     100 |     100 |                                           
  metadata_community.js |     100 |      100 |     100 |     100 |                                           
  metadata_document.js  |     100 |      100 |     100 |     100 |                                           
  models.js             |     100 |      100 |     100 |     100 |                                           
  role.js               |     100 |      100 |     100 |     100 |                                           
  user.js               |     100 |      100 |     100 |     100 |                                           
  user_role.js          |     100 |      100 |     100 |     100 |                                           
 server/routes          |   68.72 |      100 |     100 |   68.72 |                                           
  api.js                |     100 |      100 |     100 |     100 |                                           
  index.js              |   97.43 |      100 |     100 |   97.43 | 36                                        
  users.js              |    46.8 |      100 |     100 |    46.8 | 52-62,66-73,77-91,95-105,109-138          
 server/routes/api/v1   |   87.71 |      100 |     100 |   87.71 |                                           
  roles.js              |   87.71 |      100 |     100 |   87.71 | 48-54                                     
 server/seeds           |   95.09 |      100 |      50 |   95.09 |                                           
  00_users.js           |   96.36 |      100 |      50 |   96.36 | 54-55                                     
  01_roles.js           |   97.36 |      100 |      50 |   97.36 | 112-114                                   
  02_counties.js        |   95.83 |      100 |      50 |   95.83 | 47-48                                     
  03_communities.js     |   95.65 |      100 |      50 |   95.65 | 45-46                                     
  04_metadata.js        |   89.39 |      100 |      50 |   89.39 | 60-66                                     
  05_documents.js       |   94.82 |      100 |      50 |   94.82 | 56-58
```

Right away we see that a large part of our application achieves 100% code coverage with a single unit test! This highlights both how tightly interconnected all parts of our application are (such that a single unit test exercises much of the code) but also that code coverage can be a very poor metric for unit test quality (seeing this result we might suspect our application is already well tested with just a single unit test).

We have also enabled the `html` reporter, so we can see similar results in a `coverage` folder that appears inside of our `server` folder. We can use various VS Code Extensions such as [Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server) to view that file in our web browser.

{{% notice warning "Port Conflict" %}}

The Live Preview extension defaults to port 3000, so we recommend digging into the settings and changing the default port to something else before using it.

{{% /notice %}}

![Coverage Example](/images/examples/03/coverage_1.png)

In either case, we can see that we've already reached 100% coverage on our `routes/api.js` file. However, as we'll see in the next section, that doesn't always mean that we are done writing our unit tests.