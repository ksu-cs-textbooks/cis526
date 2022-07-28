---
title: "Introduction"
pre: "1. "
weight: 10
date: 2018-08-24T10:53:26-05:00
---
Node is an open-source, cross-platform JavaScript runtime environment build on Google's V8 engine.  It was created by Ryan Dahl in 2009 to allow for server-side scripting in JavaScript.  

![Ryan Dahl](/images/Ryan_Dahl.jpg)

## ECMAScript Support

Node supports most of the features of ECMAScript 2015 (ES6), with the notable exception of ES6 modules (as Node adopted the CommonJS module approach before the ES6 proposal, and the two approaches are not interchangeable).  You can learn more about Node's ES6 support [here](https://nodejs.org/en/docs/es6/).


## Differences between Browser JavaScript and Node
While JavaScript in the browser has been deliberately sandboxed and is only allowed to interact with the current document and the Internet, Node can interact with the file system and operating system of the hosting computer.  Also, because Node is not hosted in a browser, it has no Document Object Model (DOM), and no `document` or `window` global variables.  To reflect this, the global namespace for Node is `global` instead of `window`.

{{% notice info %}}
Node can be downloaded for Windows, Linux, and MacOS at [https://nodejs.org/en/](https://nodejs.org/en/). Documentation for Node is found at [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/). On many Linux and Mac systems, multiple versions of Node can be installed and managed using [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm). Using nvm may be preferred on those systems since most package repositories include older and outdated versions of Node. 
{{% /notice %}}