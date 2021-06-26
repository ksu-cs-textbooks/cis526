---
title: "Cookies"
pre: "9. "
weight: 90
date: 2018-08-24T10:53:26-05:00
draft: true
---

HTML was designed as a _stateless_ protocol.  This means that there is no expectation for the server to keep track of prior requests made to it.  Each incoming HTTP request is effectively treated as if it is the _first_ request ever made to the server.

This was an important consideration for making the web possible.  Consider what would happen if our server needed to keep track of what every visitor did on the site - especially when you have _thousands_ of unique visitors every second?  You would need a lot of memory, and a mechanism to tell which user is which. That's a lot of extra requirements to getting a web server working.

But at the same time, you probably recognize that many of the websites you use every day _must be doing just that_.  If you use Office 365 or Google Docs, they manage to store your documents, and not serve you someone else's when you log in.  When you visit an online store and place products in your shopping basket, they remain there as you navigate around the site, loadin new pages.  So how are these websites providing state?

The answer that was adopted as a W3C standard - [RFC 2695](https://tools.ietf.org/html/rfc6265) is _cookies_.  Cookies are nothing more than text that is sent along with HTTP Requests and Responses.  A server can ask a client to store a cookie with a `Set-Cookie` header.  From that point on, any request the client makes of that server will include a `Cookie` header with the cookie information.  

It's kind of like if your forgetful teacher gives you a note to show him the next time you come to office hours, to help remind him of what you talked about previously.  This way, the server doesn't have to track state for any visitor - it can ask the visitor's client (their browser) to do it for them.

## What is a Cookie?

Let's dig deeper into this idea and implementation of cookies.

Much like a web request or response, a cookie is nothing more than a stream of data. It gets passed between client and server through their headers.  Specifically, the `Set-Cookie` header sends the cookie to the client, and the client will automatically return it in subsequent requests using the `Cookie` header.  

Say we want to establish a session id, (SID), for every unique visitor to our site.  We would have our server send the SID in a `Set-Cookie` header:

`Set-Cookie: SID=234`

The browser would store this value, and on subsequent requests _to the same domain_, include a corresponding `Cookie` header:

`Cookie: SID=234`

Unless the `Domain` cookie attribute is specified (see below), a cookie is only sent to the domain that it originated from.  It will not be sent to subdomains, i.e. a cookie that came from `ksu.edu` will not be sent to the server with hostname `cs.ksu.edu`.

### Structure of a Cookie

As you might have guessed from the example, the string of a cookie is a set of key/value pairs using the equals sign (`=`) to assign the value to the key.  But we can also include multiple cookie pairs using a semicolon (`;`) to separate the cookie pairs, i.e.:

`Set-Cookie: SID=234; lang=en-US`

Both cookie pairs are sent back in a `Cookie` header:

`Cookie: SID=234; lang=en-US`

We can chain multiple pairs of cookie pairs.  After the last cookie pair, we need another semicolon, then any cookie attributes, also separated by semicolons.  For example:

`Set-Cookie: SID=234; lang=en-US; EXPIRES=Wed, 04 April 2019 011:30:00 CST`

adds a cookie attribute specifying an expiration date for the cookie.  The legal cookie attributes are laid out in [RFC6265](https://tools.ietf.org/html/rfc6265), but we'll reprint them here.

#### Cookie Attributes

There are a limited number of defined cookie attributes, and each changes the nature of the cookie and how a browser will work with it in an important way. Let's examine each in turn:

__Expires__ As you might expect, this sets an expiration date for the cookie.  After the date, the browser will throw away the cookie, removing it from its internal cache.  It will also stop sending the cookie with requests.  If you need to erase a value in a cookie you've already sent to a user, you can respond to their next request with a new `Set-Cookie` header with the `Expires` value set in the past.  To avoid issues with time zones, the date supplied must conform to the [HTTP-Date](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date) format set out in [RFC1123](https://tools.ietf.org/html/rfc1123).

__Max-Age__ The `Max-Age` also sets an expiration date, but in terms of a number of seconds from the current time. A value of 0 or less (negative) will remove the cookie from the browser's cache, and stop sending the cookie in future requests. IE 7, 8, and 9 do not support the `Max-Age` attribute; for all other browsers, `Max-Age` will take precedence over `Expires`.  

__Domain__ As described above, cookies are by default sent only to the domain from which they originated, and no subdomains.  If the domain is explicitly set with the `Domain` attribute, subdomains are included.

__Path__ The value of this attribute further limits what requests a cookie will be sent to.  If the `Path` is specified, only requests whose url matches the value will be sent.  This does include subpaths, i.e. `Path=/documents` will match the urls `/documents/`, `/documents/1.doc`, and `/documents/recent/a.pdf`.

__Secure__ Cookies including this attribute (it does not need a value) will only be sent by the browser with HTTPS requests, not HTTP requests.  Note that sending the cookie over HTTPS does not encrypt the cookie data - as a header, it is sent in the clear for both HTTP and HTTPS.

__HttpOnly__ Cookies can normally be accessed by JavaScript on the client, from the `Document.cookie` property.  Setting this attribute (it does not need a value) tells the browser not to make it accessible.

__SameSite (in Draft)__ This new cookie attribute is intended to help a server assert that its cookies should not be sent with any cross-site requests originating from this page (i.e. `<script>` tags, `<img>` tags, etc. whose source is a different site, or AJAX requests against other sites).  This is intended to help combat cross-site scripting attacks.  As you might expect, this is only supported in the newest browser versions.

## Cookies and Security

As with all web technologies, we need to consider the security implications.  Cookies are received and returned by the client - and we know that anything the client is responsible for can be manipulated by an adversarial agent.  Let's think through the implications.

All cookies received by a browser and cached there.  How long they are stored depends on the `Max-Age` and `Expires` attributes.  Browsers are told to delete cookies older than their `Max-Age`, or whose `Expires` duration has passed.  If neither of these are set, the cookie is considered a _session_ cookie - it is deleted when the browser is closed (this is why you should always close a browser you use on a public computer).

While session cookies only exist in memory, cookies with expiration dates may be persisted as text files in the browser's data directory.  If this is the case, it is a simple matter for a knowledgeable adversary with access to the computer to retrieve them.  Also remember access doesn't necessarily mean _physical_ access - malware running on your computer can effectively copy this data as well.

Moreover, cookies are just text - say for example you add the identity of your user with a cookie `Set-Cookie: user-id=735`.  An adversary could sign up for a legitimate account with your application, and then manipulate their cookie to return `Cookie: user-id:1`.  Since user ids are often incrementally generated primary keys in a database, it's a good assumption that one or two low-numbered ones will belong to administrator accounts - and this adversary has just impersonated one!

So if we need cookies to add state to our web applications, but cookies (and therefore that state) are subject to interception and manipulation - how can we protect our users and our site?

## Strategies for Making Cookies Safe(er)

Some common strategies are:

* Use HTTPS
* Store as little information in a cookie as possible 
* Encrypt the cookie's values 
* Sign the cookie
* Use Short Lifespans

### Use HTTPS 

Using Secure HTTP helps prevent cookies from being intercepted during transit, as the request body and headers are encrypted before they move across the transport layer of the Internet.  This does not protect cookies once they arrive at a user's computer, however. Still, it is a great first step.

### Storing as Little in the Cookie as Possible

A good general strategy is to store as little of importance in the cookie as possible. This also helps keep the size of a site's cookies down, which means less traffic across the network, and less to store on a user's computer.  The RFC suggests browsers support a minimum size of 4096 bytes per cookie - but this is not a requirement.

But where do we store the session information, if not in the cookie?  This is the subject of the next section, {{<ref "06-dynamic-web-servers/10-sessions.md">}}.  This strategy usually entails storing nothing more than a session identifier in the cookie, and storing the actual data that corresponds to that session identifier on the server.  Effectively, we make our server _statefull_ instead of _stateless_.

### Encrypting Cookie Values

Another common strategy is encrypting the value of a cookie using a reversible encryption algorithm before sending it to the client.  This kind of encryption technique is a mathematical function that can easily be reversed, provided you know the key used during the encryption process.  This key should be stored in the server and never shared, only used internally to encrypt outgoing cookies and decrypt incoming ones.

This strategy only works if you don't need to know the cookie's value on the client (as the client will not have the key).  Also, be wary of sending any details of the encryption with the encrypted data - anything that helps identify the encryption strategy or provides information like initialization vectors can help an adversary break the encryption.  Also, check what algorithms are considered strong enough by current standards; this is always a moving target.

### Signing Cookie Values

A third common technique is signing the cookie with a hash.  A hash is the result of a one-way cryptographic function - it is easy to perform but very difficult to reverse.  How it works is you hash the value of the cookie, and then send both the original data's value and the hashed value as cookies.  When you receive the cookie back from the client, you re-hash the value found in the cookie, and compare it to the hashed value in the cookie. If the two values are different, then the cookie has been modified.

### Use Short Lifespans

The above strategies only keep adversaries from modifying cookies.  There is still the danger of valid cookies being captured and used by an adversary - a technique known as [session hijacking](https://en.wikipedia.org/wiki/Session_hijacking). Using HTTPS can prevent session hijacking from within the network, but will not protect against cookies lifted from the client's computer.

Making sessions expire quickly can help mitigate some of the risk, especially when the adversary is using physical access to the computer to retrieve cookies - you wouldn't expect them to do this while the user is still using the computer. 

But non-physical access (such as a compromised computer) can lift a cookie while it is in use.  Regenerating a session identifier (assuming you are using the first strategy) on each login can help, especially if you prompt users to log in before allowing especially risky actions.  Adding some additional tracking information like the originating IP address to the session and prompting the user to validate a session by logging back in when this changes can also help.

Be aware that these strategies can also be very frustrating for users who are prompted to sign in repeatedly.  As always, you need to balance security concerns with user satisfaction for the kind of activities your application supports.

### Combinations of the Above

Clearly these strategies can be used in combination, and doing so will provide a better degree of safety for your clients.  But the can also increase computation time, network traffic, and user frustration within your web application.  Deciding just how much security your application needs is an important part of the design process.