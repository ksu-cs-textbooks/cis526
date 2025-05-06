---
title: "Dockerfile"
pre: "4. "
weight: 40
---

{{< youtube iX5whyRpZJ0 >}}

## Dockerfile

We are now ready to create a `Dockerfile` that will build our application into a single Docker container that can be easily deployed in a variety of different infrastructures. Because our application is really two parts (the **server** and the **client**), we can use a [Multi-Stage Build](https://docs.docker.com/get-started/docker-concepts/building-images/multi-stage-builds/) in Docker to make a very streamlined version of our image.

{{% notice note "Docker Init" %}}

In this tutorial, we'll go through building this `Dockerfile` manually. On systems that have Docker Desktop already installed, we can run `docker init` to scaffold some of this process. See the documentation for [Docker Init](https://docs.docker.com/reference/cli/docker/init/) for more details on how to use that tool.

{{% /notice %}}

## Building the Client

We'll start by creating a new `Dockerfile` outside of both the `client` and `server` folders, so it is at the top level of our project. At the top of the file, we'll add a simple `ARG` entry to denote the version of Node.js we want to use:

```docker {title="Dockerfile"}
# Node Version
ARG NODE_VERSION=22
```

Next, we need to chose the Docker image we want to use to build our client. There are many different options to choose from, but we can look at the [Official Docker Node](https://hub.docker.com/_/node/) package list to find the correct one fo our project. In this case, we'll use the image `22-alpine` as the basis for our Docker image. When building Docker images for deployment, we often look for images based on the Alpine Linux distribution, which is very lightweight and generally more secure since it only contains the bare minimum set of features needed for our application. We can read more about using Alpine Docker images in the [Docker Blog](https://www.docker.com/blog/how-to-use-the-alpine-docker-official-image/)

So, we'll add a `FROM` entry to define the source of our build process, and we'll name this container `client` to help us keep track of it.

```docker {title="Dockerfile"}
# Node Version
ARG NODE_VERSION=22

# Client Base Image
# See https://hub.docker.com/_/node/
FROM node:${NODE_VERSION}-alpine as client
```

Now, we need to actually build our application. This usually involves 2 steps:
1. Copy our code to the container image
2. Run the build process to build our application

However, we can further optimize this by realizing that we can further separate this by installing all of our Node libraries first, then building our application. Since each step creates a new [Docker Image Layer](https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/), we can make our images more efficient by spreading these steps out. 

By doing so, if we make a change to the source code of our application, but we don't change the underlying Node libraries, we can reuse that earlier image layer containing our libraries since we know that it hasn't changed at all. We can read more about this in the [Docker Documentation](https://docs.docker.com/build/cache/optimize/) on optimizing builds by using caching.

In practice, the steps will look like this:

```docker {title="Dockerfile"}
# Node Version
ARG NODE_VERSION=22

###############################
# STAGE 1 - BUILD CLIENT      #
###############################

# Client Base Image
# See https://hub.docker.com/_/node/
FROM node:${NODE_VERSION}-alpine as client

# Use production node environment by default
ENV NODE_ENV production

# Store files in /usr/src/app
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
# See https://docs.docker.com/build/cache/optimize/
RUN --mount=type=bind,source=client/package.json,target=package.json \
    --mount=type=bind,source=client/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

# Copy the rest of the source files into the image.
COPY ./client .

# Build the client application
RUN npm run build
```

At the end of this process, we'll have a Docker image named `client` that contains a completely compiled version of our application in the `/usr/src/app/dist` folder. That's really the important outcome of this process.

## Building the Server

On the server side of things, there are several files and folders we want to make sure are not included in our final Docker image. So, we can create a file `server/.dockerignore` with the following contents:

```dockerignore {title=".dockerignore"}
node_modules
coverage
.env
.env.example
.env.test
.prettierrc
database.sqlite
eslint.config.js
public
```

These are all folders and files that contain information we don't want to include for a variety of security reasons.

Now, we can initiate the second stage of this build process, which will create a finalized version of our server to run our application. We'll continue building this in the same `Dockerfile` below the first stage. The first few steps are mostly identical to the client, except this time we are referencing content in the `server` folder. 

```docker {title="Dockerfile"}
#  -=-=- other code omitted here -=-=-

###############################
# STAGE 2 - BUILD SERVER      #
###############################

# Server Base Image
# See https://hub.docker.com/_/node/
FROM node:${NODE_VERSION}-alpine as server

# Use production node environment by default
ENV NODE_ENV production

# Store files in /usr/src/app
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
# See https://docs.docker.com/build/cache/optimize/
RUN --mount=type=bind,source=server/package.json,target=package.json \
    --mount=type=bind,source=server/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy the rest of the source files into the image
COPY ./server .
```

{{% notice note "Node Dev Dependencies" %}}

Notice that the `client` build step uses `npm ci --include=dev` to include the development dependencies for the Vue.js project. These dependencies include tools such as Vite that are actually required to build the project for production, so we have to make sure they are installed.

In the `server` build step, however, we are using `npm ci --omit=dev` to omit any development dependencies from being installed in the container. These dependencies should be tools such as Nodemon and ESLint, which we won't need in the deployed version of our application.

If we run into errors at either of these steps, we may need to ensure that each Node dependency is properly included in the correct place of the respective `package.json` file for each project.

{{% /notice %}}

Once we have installed the libraries and copied the contents of the `server` folder into the `server` image, we can also copy the `/usr/src/app/dist` folder from the `client` image into the `public` folder of the `server` image.

```docker {title="Dockerfile"}
#  -=-=- other code omitted here -=-=-

###############################
# STAGE 2 - BUILD SERVER      #
###############################

# Server Base Image
# See https://hub.docker.com/_/node/
FROM node:${NODE_VERSION}-alpine as server

# Use production node environment by default
ENV NODE_ENV production

# Store files in /usr/src/app
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
# See https://docs.docker.com/build/cache/optimize/
RUN --mount=type=bind,source=server/package.json,target=package.json \
    --mount=type=bind,source=server/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy the rest of the source files into the image
COPY ./server .

# Copy the built version of the client into the image
COPY --from=client /usr/src/app/dist ./public
```

Then, we'll need to make a couple of directories in our container that we can use as volume mounts when we deploy it. These directories will contain our database and our uploaded files:

```docker {title="Dockerfile"}
#  -=-=- other code omitted here -=-=-

###############################
# STAGE 2 - BUILD SERVER      #
###############################

# Server Base Image
# See https://hub.docker.com/_/node/
FROM node:${NODE_VERSION}-alpine as server

# Use production node environment by default
ENV NODE_ENV production

# Store files in /usr/src/app
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
# See https://docs.docker.com/build/cache/optimize/
RUN --mount=type=bind,source=server/package.json,target=package.json \
    --mount=type=bind,source=server/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy the rest of the source files into the image
COPY ./server .

# Copy the built version of the client into the image
COPY --from=client /usr/src/app/dist ./public

# Make a directory for the database and make it writable
RUN mkdir -p ./data
RUN chown -R node:node ./data

# Make a directory for the uploads and make it writable
RUN mkdir -p ./public/uploads
RUN chown -R node:node ./public/uploads
```

Finally, we'll end by defining the user the container should use, the default port of our application, a command to check if the application in the container is healthy, and the command to start our application. 

```docker {title="Dockerfile"}
#  -=-=- other code omitted here -=-=-

###############################
# STAGE 2 - BUILD SERVER      #
###############################

# Server Base Image
# See https://hub.docker.com/_/node/
FROM node:${NODE_VERSION}-alpine as server

# Use production node environment by default
ENV NODE_ENV production

# Store files in /usr/src/app
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
# See https://docs.docker.com/build/cache/optimize/
RUN --mount=type=bind,source=server/package.json,target=package.json \
    --mount=type=bind,source=server/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy the rest of the source files into the image
COPY ./server .

# Copy the built version of the client into the image
COPY --from=client /usr/src/app/dist ./public

# Make a directory for the database and make it writable
RUN mkdir -p ./data
RUN chown -R node:node ./data

# Make a directory for the uploads and make it writable
RUN mkdir -p ./public/uploads
RUN chown -R node:node ./public/uploads

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Command to check for a healthy application
HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api || exit 1

# Run the application.
CMD npm run start
```

There we go! That is what it takes to build a deployable version of this application. Notice that the `Dockerfile` we created here is very different from the devcontainer image we are using to develop our application in. A common misconception when using Docker is that we can use the same image for both development and deployment, but generally that is a very insecure and unsafe practice. It is much better to have a fully-featured image available for development, and then use a very secure and minimal image for deployment, often one that is built using a multi-stage build process that takes advantage of layer caching to make it much more efficient. 

