---
title: "Request Format"
pre: "3. "
weight: 30
date: 2018-08-24T10:53:26-05:00
---

So now that we've seen HTTP Requests in action, let's examine what they _are_.  A HTTP Request is just a stream of text that follows a specific format and sent from a client to a server.  

![Http Request as a stream of text](/images/2.3.1.png)

It consists of one or more lines terminated by a CRLF (a carriage return and a line feed character, typically written `\r\n` in most programming languages).

1. A _request-line_ describing the request 
2. Additional optional lines containing HTTP headers.  These specify details of the request or describe the body of the request 
3. A blank line, which indicates the end of the request headers
4. An optional body, containing any data belonging of the request, like a file upload or form submission.  The exact nature of the body is described by the headers.

## The Request-Line 
The request-line follows the format 

`Request-Line = Method SP Request-URI SP HTTP-Version CRLF`

The _Method_ refers to the HTTP Request Method (often GET or POST).   

_SP_ refers to the space character. 

The _Request-URI_ is a Universal Request Indicator, and is typically a URL or can be the asterisk character (\*), which refers to the server instead of a specific resource. 

_HTTP-Version_ refers to the version of the HTTP protocol that will be used for the request.  Currently three versions of the protocol exist: `HTTP/1.0`, `HTTP/1.1`, and `HTTP/2.0`.  Most websites currently use HTTP/1.1 (HTTP/2.0 introduces many changes to make HTTP more efficient, at the cost of human readability.  Currently it is primarily used by high-traffic websites).

Finally, the _CRLF_ indicates a carriage return followed by a line feed.

For example, if we were requesting the about.html page of a server, the request-line string would be: 

`GET /about.html HTTP/1.1\r\n`

## The Headers 
Header lines consist of key-value pairs, typically in the form 

`Header = Key: Value CRLF`

Headers provide details about the request, for example, if we wanted to specify we can handle the _about.html_ page data compressed with the gzip algorithm, we would add the header: 

`Accept-Encoding: compress, gzip\r\n`

The server would then know it could send us a zipped version of the file, resulting in less data being sent from the server to the client.

If our request includes a body (often form data or a file upload), we need to specify what that upload data is with a Content-Type header and its size with a Content-Length header, i.e.:

`Content-Length: 26012
Content-Type: image/gif`

## A Blank Line 
The header section is followed by a blank line (a CRLF with no characters before it). This helps separate the request metadata from the request body.  

## The Request Body
The body of the request can be text (as is the case for most forms) or binary data (as in an image upload).  This is why the Content-Type header is so important for requests with a body; it lets the server know how to process the data.  Similarly, the Content-Length header lets us know how many bytes to expect the body to consist of.  

It is also acceptable to have no body - this is commonly the case with a GET request.  If there is no body, then there are also no required headers.  A simple get request can therefore consist of only the request-line and blank line, i.e.:

`GET /about.html HTTP/1.1\r\n\r\n`

{{% notice info %}}
The HTTP/1.1 request definition can be found in [W3C RFC 2616 Section 5](https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html#sec5)
{{% /notice %}}
