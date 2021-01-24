---
title: "APIs"
pre: "7. "
weight: 70
date: 2018-08-24T10:53:26-05:00
---

Before we step away from routing, we should take the time to discuss a specific style of web application that goes hand-in-hand with routing - an Application Programming Interface (API).  An API is simply a interface for two programs to communicate, to allow one to act as a service for the other.  Web APIs are APIs that use hyper-text transfer protocol (http) as the mechanism for this communication.  Thus, the client program makes HTTP requests against the API server and receives responses.  The [Placeholder.com](https://placeholder.com/) we discussed earlier in this chapter is an example of a web API - one that generates and serves placeholder images.

In fact, an API can serve _any_ kind of resource - binary files, image files, text files, etc.  But most serve data in one of a few forms:

* **HTML that is intended to be embedded in a web page**, common to advertisement revenue services, embeddable social media feeds, YouTube and other video embedding sites.
* **Data structured as JSON**, a _very_ common format for submitting or retrieving any kind of data across the web. For data that will be used by JavaScript running in the browser, it has the advantage of being the native format.
* **Data structured as XML**, another common format, XML tends to be slightly larger than the equivalent JSON, but it can have a published and enforced structure.

## Some Example Web APIs

There are thousands of Web APIs available for you to work with.  Some you might be interested in investigating include:
* [The National Weather Service API](https://www.weather.gov/documentation/services-web-api) - we used this API early in the course to retrieve weather forecast data. As the NWS is supported by tax dollars, this resource is free to use.
* [Census APIs](https://www.census.gov/data/developers/data-sets.html) similarly, the U.S. Census Bureau makes much of their data sets available through APIs
* [NASA APIs](https://api.nasa.gov/) as does NASA.
* [Google Maps](https://developers.google.com/maps/documentation) has extensive APIs for maps and geolocation, with a fee structure.
* [Open Street Maps](https://wiki.openstreetmap.org/wiki/API) offers an open-source alternative.
* [Facebook](https://developers.facebook.com/docs/apis-and-sdks/) has a large collection of APIs for working with their data and navigating social network relationships.
* [GitHub](https://developer.github.com/v3/) provides an API for developing tools to work with their site.
