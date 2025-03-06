---
title: "Linting & Formatting"
pre: "10. "
weight: 100
---

{{< youtube 1AIUiGW2FNs >}}

## Linting

Finally, let's look at two other tools that will help us write clean and maintainable JavaScript code. The first tool is [eslint](https://www.npmjs.com/package/eslint), which is a [linting](https://en.wikipedia.org/wiki/Lint_(software)) tool to find bugs and issues in JavaScript code by performing some static analysis on it. This helps us avoid any major issues in our code that can be easily detected just by looking at the overall style and structure of our code.

To begin, we can install `eslint` following the recommended process in their documentation:

```bash {title="terminal"}
$ npm init @eslint/config@latest
```

It will install the package and ask several configuration questions along the way. We can follow along with the answers shown in the output below:

``` {title="output"}
Need to install the following packages:
@eslint/create-config@1.4.0
Ok to proceed? (y) y

@eslint/create-config: v1.4.0

✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · javascript
✔ Where does your code run? · node
The config that you've selected requires the following dependencies:

eslint, globals, @eslint/js
✔ Would you like to install them now? · No / Yes
✔ Which package manager do you want to use? · npm
☕️Installing...

added 70 packages, and audited 273 packages in 5s

52 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Successfully created /workspaces/example-project/server/eslint.config.js file.
```

Once it is installed, we can run `eslint` using the following command:

```bash {title="terminal"}
$ npx eslint --fix .
```

When we do, we'll probably get a couple of errors:

``` {title="output"}
/workspaces/example-project/server/routes/index.js
  35:36  error  'next' is defined but never used  no-unused-vars

/workspaces/example-project/server/routes/users.js
  35:36  error  'next' is defined but never used  no-unused-vars

✖ 2 problems (2 errors, 0 warnings)
```

In both of our routes files, we have included the `next` parameter, but it is unused. We could remove it, but it is often considered good practice to include that parameter in case we need to explicitly use it. So, in our `eslint.config.js` we can add an option to ignore that parameter (pay careful attention to the formatting; for some reason the file by default does not have much spacing between the curly braces):

```js {title="eslint.config.js" hl_lines="8-15"}
import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.node },
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: 'next'
        }
      ]
    }
  },
  pluginJs.configs.recommended,
];
```

Now, when we run that command, we should not get any output!

```bash {title="terminal"}
$ npx eslint --fix .
```

To make this even easier, let's add a new script to the `scripts` section of our `package.json` file for this tool:

```json {title="package.json" hl_lines="6"}
{
  ...
  "scripts": {
    "start": "LOG_LEVEL=http node ./bin/www",
    "dev": "LOG_LEVEL=debug nodemon ./bin/www",
    "lint": "npx eslint --fix ."
  },
  ...
}
```

Now we can just run this command to check our project for errors:

```bash {title="terminal"}
$ npm run lint
```

## Formatting 

Another commonly used tool for JavaScript developers is [prettier](https://www.npmjs.com/package/prettier). Prettier will reformat our JavaScript code to match a defined coding style, making it much easier to read and maintain.

First, let's install `prettier` using `npm` as a development dependency:

```bash {title="terminal"}
$ npm install prettier --save-dev
```

We also need to create a `.prettierrc` configuration file that just contains an empty JavaScript object for now:

```js {title=".prettierrc"}
{}
```

There are many options that can be placed in that configuration file - see the [Prettier Documentation](https://prettier.io/docs/en/options) for details. For now, we'll just leave it blank.


We can now run the `prettier` command on our code:

```bash {title="terminal"}
$ npx prettier . --write
```

When we do, we'll see output listing all of the files that have been changed:

``` {title="output"}
.prettierrc 34ms
app.js 34ms
configs/logger.js 19ms
configs/openapi.js 7ms
eslint.config.js 5ms
middlewares/request-logger.js 5ms
package-lock.json 111ms (unchanged)
package.json 2ms (unchanged)
public/index.html 29ms
routes/index.js 4ms
routes/users.js 3ms
```

Notice that nearly all of the files have been updated in some way. Many times it simply aligns code and removes extra spaces, but other times it will rewrite long lines.

Just like with `eslint`, let's add a new script to `package.json` to make this process simpler as well:

```json {title="package.json" hl_lines="7"}
{
  ...
  "scripts": {
    "start": "LOG_LEVEL=http node ./bin/www",
    "dev": "LOG_LEVEL=debug nodemon ./bin/www",
    "lint": "npx eslint --fix .",
    "format": "npx prettier . --write"
  },
  ...
}
```

With that script in place, we can clean up our code anytime using this command:

```bash {title="terminal"}
$ npm run format
```

{{% notice tip "Best Practice" %}}

Now that we have installed both `eslint` and `prettier`, it is always a good practice to run both tools before committing any code to git and pushing to GitHub. This ensures that your codebase is always clean, well formatted, and free of errors or bugs that could be easily spotted by these tools.

{{% /notice %}}

This is a good point to **commit and push** our work!