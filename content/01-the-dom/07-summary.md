---
title: "Summary"
pre: "7. "
weight: 70
date: 2018-08-24T10:53:26-05:00
---

In this chapter, we reviewed the Document Object Model (the DOM), the tree-like structure of HTML elements built by the browser as it parses an HTML document.  We discussed how CSS rules are applied to nodes in this tree to determine how the final webpage will be rendered, and how JavaScript can be used to manipulate and transform the DOM (and the resulting webpage appearance).

We also discussed how JavaScript events work, and how this event-driven approach is the basis for implementing concurrency within the language.  We'll see this more as we delve into Node.js, which utilizes the same event-based concurrency model, in future chapters.

Finally, we discussed how supplemental files (images, videos, CSS files, JavaScript files) are loaded by the browser concurrently.  We saw how this can affect the functioning of JavaScript that depends on certain parts of the page already having been loaded, and saw how we can use the `load` event to delay running scripts until these extra files have completed loading.