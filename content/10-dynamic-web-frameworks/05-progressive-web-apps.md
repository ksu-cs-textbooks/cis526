---
title: "Progressive Web Apps"
pre: "5. "
weight: 50
date: 2018-08-24T10:53:26-05:00
---

A next step in the evolution of single-page apps is the [progressive web application (PWA)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps).  While these are web applications, they also provide a native-like feel when running in a phone or tablet, and can usually have a shortcut saved to the desktop. It is built around several new web standards that provide specific functionality:

## Secure Context 
A PWA is always served with https.  Also, many features that a PWA might want to use (geolocation, the camera) are only available to a site served over http.

## Service Worker
A service worker is a JavaScript script (much like the web workers we learned about earlier) that manages communication between the app running in the browser and the network.  Most specifically, it is used to cache information for when the network is unavailable, which can allow your app to run offline.

## Manifest File 
The manifest is a JSON file that describes the application (much like the Node package.json) that provides the details necessary to load the app and "install" it on mobile devices.  Note that installing essentially means running a locally cached copy of the website.