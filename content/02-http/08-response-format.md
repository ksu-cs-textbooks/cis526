---
title: "Response Format"
pre: "8. "
weight: 80
date: 2018-08-24T10:53:26-05:00
---

Similar to an HTTP Request, an HTTP response is typically a stream of text and possibly data:

![HTTP Response as a stream of text and data](/images/2.8.1.png)

It consists of one or more lines of text, terminated by a CRLF (sequential carriage return and line feed characters):

1. A _status-line_ indicating the HTTP protocol, the status code, and a textual status
2. Optional lines containing the Response Headers.  These specify the details of the response or describe the response body
3. A blank line, indicating the end of the response metadata 
4. An optional response body.  This will typically be the text of an HTML file, or binary data for an image or other file type, or a block of bytes for streaming data.

## The Status-Line 
The status-line follows the format 

`Status-Line = HTTP-Version SP Status-Code SP Reason-Phrase CRLF`

The _HTTP-Version_ indicates the version of the HTTP protocol that is being used (HTTP/1.0, HTTP/1.1, or HTTP/2.0).

_SP_ refers to a space character.

The _Status-Code_ is a three-digit numeric representation of the response status. Common codes include 200 (OK), 404 (Not Found), and 500 (Server Error).

The _Reason-Phrase_ is a plain-text explanation of the status code.

## Response Headers 
Just like HTTP Requests, a HTTP response can contain headers describing the response.  If the response has a body, a Content-Type and Content-Length header would be expected.

## A Blank Line 
The header section is followed by a blank line (a CRLF with no characters before it). This helps separate the response metadata from the response body. 

## Response Body
The response body contains the data of the response.  it might be text (as is typically the case with HTML, CSS, or JavaScript), or a binary file (an image, video, or executable).  Additionally, it might only be a sequence of bytes, as is the case for streaming media.

{{% notice info %}}
The full HTTP/1.1 response definition can be found in [W3C RFC 2616 Section 6](https://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html#sec6).
{{% /notice %}}