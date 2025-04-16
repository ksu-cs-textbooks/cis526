---
title: "Preparing for Deployment"
pre: "3. "
weight: 30
---

{{< youtube id >}}

## Preparing for Deployment

At this point, we have a pretty well developed application, so let's start preparing for deployment. Our end goal is to build a single Docker container that contains our application, as well as the ability to deploy it along with a production database like [Postgres](https://www.postgresql.org/).

To begin, we need to create a finalized version of our Vue frontend that can be embedded into our backend application directly. 

## Building in Vue

To create a deployment build of our Vue application, we can simply run the following command in the `client` folder of our application:

```bash {title="terminal"}
$ npm run build
```

When we run that command, we get lots of output about the different parts of our application that are put together to make the final version. We may also get some warnings about chunks being larger than the cutoff, which we won't worry about for now.

The final version of our application can be found in a new `dist` folder inside of our `client` folder, with a long list of contents:

![Dist Folder Contents](/images/examples/07/build_dist.png)

The `assets` folder contains a large number of items that are all compiled and assembled by the Vite build tool for our application. The key file, however, is the `index.html` file, which is placed there to serve as the starting point for our application.

## Testing the Built Application

To fully test this application, we 