---
title: "Partial Downloads"
pre: "7. "
weight: 70
date: 2018-08-24T10:53:26-05:00
---

While we normally think of downloading an entire file from the web, there are some situations where it makes sense to download only _part_ of a file.  One case is with a large file download that gets interrupted - it makes a lot of sense to start downloading the remaining bytes from where you left off, rather han starting over again. A second case is when you are streaming media; often the user may not watch or listen to the entire media file, so why download the bytes they don't need?  Or if it is a live stream, we explicitly _can't_ download the entire thing, because later parts do not yet exist!

## Range Headers

HTTP explicitly supports requesting only a part of a resource with the [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header.  This allows us to specify the unit of measure (typically bytes), a starting point, and an optional end.  This header is structured:

```
Range: <unit>=<range-start>-<range-end>
```

Where `<unit>` is the unit of measure, the `<range-start>` is the start of the range to send, measured in the provided unit, and `<range-end>` is the end of the range to send.  

Thus, a real-world Range header might look like:

```
Range: bytes=200-300
```

You can also specify only the starting point (useful for resuming downloads):

```
Range: <unit>=<range-start>-
```

Finally, you can specify multiple ranges separated by commas:

```
Range: <unit>=<range1-start>-<range1-end>, <range2-start>-<range2-end>, <range3-start>-
```

Of course, as with all request headers, this indicates a desire by the web client.  It is up to the web server to determine if it will be honored.

### Partial Content

Which brings us to the **206 Partial Content** response status code.  If the server chooses to honor a range specified in the request header, it should respond with this status code, and the body of the response should be just the bytes requested.

In addition, the response [Content-Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) header should be included with the response, specifying the actual range of bytes returned.  This is similar to the Range header, but includes a the total size:

```
Content-Range: <unit> <range-start>-<range-end>/<size>
```
An asterisk (`*`) can be used for an unknown size.

Also, the [Content-Type]() header should also be included, and match the type of file being streamed.

If _multiple_ ranges are included in the response, the Content-Type is `"multipart/byteranges"` and the response body is formatted similarly to multipart form data.