---
title: "Request Body"
pre: "7. "
weight: 70
date: 2018-08-24T10:53:26-05:00
---
After the request headers and an extra CRLF (carriage return and line feed) is the request body.  

For GET and DELETE requests, there is no body.  For POST, PUT, and PATCH, however, this section should contain the data being sent to the server.  If there is a body, the headers should include `Content-Type` and `Content-Length`.  The `Content-Length` is always provided as a count of [octets](https://en.wikipedia.org/wiki/Octet_(computing)) (a set of eight bits).  Thus, binary data is sent as an _octet stream_.  Text data is typically sent in [UTF-8 encoding](https://en.wikipedia.org/wiki/UTF-8).

Two body formats bear special mention: `application/x-www-form-urlencoded` and `multipart/form-data`.  These encodings are commonly used for submitting HTML forms, and will be covered in more detail in the Form Data chapter.