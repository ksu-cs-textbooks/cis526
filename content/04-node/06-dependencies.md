---
title: "Dependencies"
pre: "6. "
weight: 60
date: 2018-08-24T10:53:26-05:00
---

A second great benefit of creating your project as a Node package is that dependencies can be managed using the Node Package Manager (npm).  You can install any Node package with the command `$npm install [package name]`.  This command looks for the corresponding package in an online repository, and if it is found, downloads it and saves it to the subdirectory _node_modules_ in your package directory. 

It also creates an entry in the _package.json_ file corresponding to the package you installed, and also an entry in the _package.lock.json_ file.  The entry in your _package.json_ file may specify a specific version, i.e.:

```json
{
    "name": "example-package",
    "version": "1.0.0",
    "dependencies": {
        "foo": "2.1.3",
        "bar": "^1.1.0",
        "doh": "~4.3.2"
    }
}
```

The `^` before the `"bar"` dependency indicates that npm can use any _minor release_ after this version, i.e. we could use **bar 1.2.1** but not bar **2.1.1**.  The `~` before the `"doh"` dependency indicates that npm can use any _patch release_ after this version, i.e. **doh 4.3.4** but not **doh 4.4.0**.  Because we specified the _exact_ version for `"foo"`, it will always install **foo 2.1.3**.  We could also indicate we will accept _any_ major version with an `*`, but this is rarely used.  Additionally, we can specify a git repo or a location on our hard drive, though these approaches are also not commonly used.

The reason we want the dependency information specified this way is that when we commit our package to source control, we typically _exclude_ the dependencies found in **node_modules**.  As this folder can get quite large, this saves us significant space in our repository.  When you clone your package to a new location, you can re-install the dependencies with the command:

```bash
$ npm install 
```

This will pull the latest version of each dependency package allowable.  Additionally, some modules may have their own dependencies, in which case npm will strive to find a version that works for all requirements.

Finally, the _package.lock.json_ contains the _exact_ version of the dependencies installed. It _is_ intended to be committed to your repository, and if it exists it will make the `npm install` command install the exact same packages.  This can help avoid problems where two versions of a package are slightly different.

## Development Dependency
In addition to regular dependencies, we can specify dependencies we only need during development.  Adding the `--save-dev` flag to the command will add the package to a _development_ dependency list in your _package.json_ file.  Development dependencies are only installed in the development environment; they are left out in a production environment. 


{{% notice info %}}
## The NPM Registry 
There are many ways to connect with dependencies, but one of the easiest and most popular is to use the [NPM Registry](https://www.npmjs.com/), a searchable, online directory of npm packages maintained by npm, Inc. You can search for keywords and (hopefully) find a project that fits your needs.
{{% /notice %}}

