---
title: "Sessions"
pre: "10. "
weight: 100
date: 2018-08-24T10:53:26-05:00
---

If HTTP is stateless, how do e-commerce websites manage to keep track of the contents of your shopping cart as you navigate from page to page? The answer is the use of a _session_ - a technique by which state is added to a web application.

{{% notice info %}}

The term **session** appears a _lot_ in web development, and can mean different things in different contexts.  But there is a common thread in each - a session is a form of connection between the client and server.

For example, when your web client make a request from a web server, it opens a Transmission Control Protocol (TCP) session to the server, and sends the HTTP request across this connection.  The session stays open until all the packets of the request are sent, and those of the response are recieved.  In HTTP 1.1, the session can stay open for more than a single request-response pair, as it is anticipated a HTML page request will be followed by requests for resources (CSS, JavaScript, images, etc.) embedded in the page.  HTTP 2.0 takes this farther, allowing the server to _push_ these additional resources to the client.

The sessions we are discussing here are implemented at a higer level than TCP sessions (though they are hosted by the TCP session), and represent a single website visitor interacting with the server.

{{% /notice %}}

A session therefore provides a mechanism for storing information between requests, and must be unique to a specific user.  All session techniques begin with a cookie, so you should be familiar with that concept.

There are three basic session techniques you will likely encounter in web development.  Let's take a look at each.

## Cookie Session

In a cookie session, the session information is completely stored within the cookie.  This has the benefit that no state information needs to be stored on the server, and it is easy to implement.  

There are several downsides to the cookie session.  The first is that it comes with a limited amount of reliable storage (the standard suggests that browsers support a minimum cookie size of 4096 bytes per cookie, but there is no hard requirement).  Second, cookies are somewhat vulnerable, as they can be intercepted in-transit, and they can also be recovered from a browser's cookie storage by a knowledgable adversary.

## In-Memory Cookies

A second approach is to store the session data on the server using some form of memory cache.  A straightforward implementation for a Node server would be to use an object, i.e.:

```js
var sessions = {}
```

Each time a new visitor comes to the website, a unique ID is generated, and used as the the key for their session, and sent to the client as a cookie, i.e.:

```js
var sessionID = [some unique id];
res.setHeader("Set-Cookie", `session-id=${sessionID}; lang=en-US`);
sessions[sessionID] = {
    // session data here
}
```

On subsequent requests, the cookie can be retrieved from the request and used to retrieve the session data:

```js
var cookie = req.headers["cookie"];
var sessionID = /session-id=([^;])/.match(cookie);
var session = sessions[sessionID];
```

Because the session data is never sent in its raw form to the client, it is more secure.  However, the session can still be hijacked by a malicious user who copies the cookie or guesses a valid session id.  To counter this, all requests should be updated to use secure protocol (https) and the cookie should be encrypted.

Also, in-memory sessions are lost when the server reboots (as they are held in volitale memory).  They should also be cleaned out periodically, as each session consumes working memory, and if a session is more than an hour old it probably will not be used again.

## Database Cookies 

A database cookie is one stored in the website's database.  Functionally, it is similar to an In-Memory cookie, except that the database becomes the storage mechanism.  Because the database offers persistent storage, the session also could be persistent (i.e. you remain "logged on" every time you visit from the same computer).  Still, database sessions typically are cleaned out periodically to keep the sessions table from growing overlarge.

Database cookies are a good choice if your website is already using a database.  For a website with registered users, the session id can be the user's id, as defined in the database schema.