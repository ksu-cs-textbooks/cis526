---
title: "Packages"
pre: "5. "
weight: 50
date: 2018-08-24T10:53:26-05:00
---

The Node Package Manager allows you to create a _package_ representing your project.  This is similar to Visual Studio's idea of a _project_ - a package is a complete Node program.

Just as Visual Studio adds solution and project files, a Node package adds a file named _package.json_ and a directory named *node_modules*.

## The Package File

Every node package has in its top-level directory a file named _package.json_.  This JSON file provides important information about the project, including:

* The name of the project 
* The version of the project
* The author of the project
* The entry point (the file that should be processed first, much like a C# _Program.cs_ file or C++ _main.cpp_ file). Owing to its roots as a language for developing webservers, the default is _index.js_, though it can be anything you want (many projects use _server.js_ or _main.js_).
* Any scripts associated with the project (often we'll have scripts to run and test the project)
* Any dependencies of the project (these are additional packages that are copied into the *node_modules* file)
* The home repository of the project (often a GitHub repository, though other options are possible)
* The license under which this package is released

Most of the properties of the _package.json_ are optional, and there are options I have listed above are not comprehensive. The _package.json_ object format is described in great detail in the [npm documentation](https://docs.npmjs.com/files/package.json).

## Semantic Versioning

Node packages use [semantic versioning](https://semver.org/), a numbering scheme that uses three numbers separated by periods in the pattern `MAJOR.MINOR.PATCH`.  For example, your Codio Box is likely running **Ubuntu 18.04.3** - that is Ubuntu, major release 18, minor release 4, patch 3.  If its developers found a bug or security vulnerability and fixed it, they would release a new patch version, i.e. **Ubuntu 18.04.4**.  If they made some improvements that don't change the way you work with the operating system, those might be a minor release, i.e. **Ubuntu 18.05.0** (note that the patch release number starts over at 0).  And if a major change in the way the software works was made, that would be a major release, i.e. **Ubuntu 19.0.0**.  Additionally, you probably have seen the program listed as **Ubuntu 18.04.4 LTS**.  The LTS is not part of semantic versioning, but indicates this is a _long term support_ release, i.e. one the developers have committed to fixing problems with for a specific duration of time.

When releasing your own Node packages, you should strive to practice using semantic versioning. That way you get into the habit, and it will be easier when you become a professional developer.  Another good practice is to have a _changelog_ - a text or markdown file that lists the changes made in each successive version of the program, usually as a bulleted list.

## Initializing the Package
You can manually create the _package.json_ file, but npm also provides a wizard to make this process easier.  From the terminal, while at the root directory of your project, enter the command:

```bash
$ npm init
```

This will launch the wizard, asking you a series of questions used to create the project.  It will also offer default options for many of the values; you can simply press the space bar to accept these.  Moreover, if your directory contains an already-initialized git repository, it will use that repository's origin as the basis for the repository option.  The wizard will create the _package.json_ file in the project's root directory. 

Next we'll look at some aspects of the package in more detail.