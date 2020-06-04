---
title: "Request Methods"
pre: "4. "
weight: 40
date: 2018-08-24T10:53:26-05:00
---

The first line of the HTTP request includes the __request method__, which indicates what kind of action the request is making of the web server (these methods are also known as __HTTP Verbs__).  The two most common are _GET_ and _POST_, as these are supported by most browsers.  

### Commonly HTTP Methods
The following requests are those most commonly used in web development.  As noted before GET and POST requests are the most commonly used by web browsers, while GET, PUT, PATCH, and DELETE are used by RESTful APIs. Finally, HEAD can be used to optimize web communications by minimizing unnecessary data transfers.

#### GET 
A _GET_ request seeks to retrieve a specific resource from the web server - often an HTML document or binary file.  GET requests typically have no body and are simply used to retrieve data.  If the request is successful, the response will typically provide the requested resource in its body.

#### HEAD 
A _HEAD_ request is similar to a GET request, except the response is not expected to provide a body.  This can be used to verify the type of content of the resource, the size of the resource, or other metadata provided in by the response header, without downloading the full data of the resource.

#### POST
The _POST_ request submits an entity to the resource, i.e. uploading a file or form data.  It typically will have a body, which is the upload or form.  

#### PUT 
The _PUT_ request is similar to a POST request, in that it submits an entity as its body.  It has a more strict semantic meaning though; a PUT request is intended to _replace_ the specified resource in its entirety.

#### PATCH 
The _PATCH_ request is also similar to POST and PUT requests - it submits an entity as its body. However, its semantic meaning is to only apply partial modifications the specified entity.

#### DELETE
As you might expect, the DELETE method is used to delete the specified resource from the server.

{{% notice info %}}
Additional methods include _CONNECT_, which establishes a tunnel to a server; _OPTIONS_, which identifies communications options with a resource, and _TRACE_, which performs a message loop-back test to the target resource. HTTP Methods are defined in [W3C's RFC2616](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html).
{{% /notice %}}
