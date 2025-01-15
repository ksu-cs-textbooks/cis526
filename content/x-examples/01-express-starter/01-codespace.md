---
title: "GitHub CodeSpace"
pre: "1. "
weight: 10
---

{{< youtube id >}}

## Creating a Codespace

To begin, we will start with an empty GitHub repository. You can either create one yourself, or you may be working from a repository provided through GitHub Classroom. 

At the top of the page, you may see either a **Create a Codespace** button in an empty repository, or a **Code** button that opens a panel with a **Codespaces** tab and a **Create Codespace on main** button in an initialized repository. Go ahead and click that button.

![Codespace in Empty Repository](images/examples/01/codespace_1.png)

![Codespace in Initialized Repository](images/examples/01/codespace_2.png)

Once you do, GitHub will start creating a new [GitHub Codespace](https://github.com/features/codespaces) for your project. This process may take a few moments. 

Once it is done, you'll be presented with a window that looks very similar to Visual Studio Code's main interface. In fact - it is! It is just a version of Visual Studio Code running directly in a web browser. Pretty neat!

For the rest of this project, we'll do all of our work here in GitHub Codespaces directly in our web browser.

{{% notice note "Working Locally?" %}}

If you would rather do this work on your own computer, you'll need to install the following prerequisites:

* [Visual Studio Code](https://code.visualstudio.com/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

For now, you'll start by cloning your GitHub repository to your local computer, and opening it in Visual Studio Code. We'll create some configuration files, and then reopen the project using a Dev Container in Docker.

{{% /notice %}}