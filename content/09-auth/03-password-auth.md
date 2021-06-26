---
title: "Password Authentication"
pre: "3. "
weight: 30
date: 2018-08-24T10:53:26-05:00
---

One of the more common approaches used in modern dynamic webservers - especially those that are already using a database - is to have each user create an account and log in with a username and password.  The primary difference in this approach from the HTTP Basic one is that:

1. the webserver provides a login page with a form for submitting the username/password (allowing it to be customized to match the site)
2. On an successful authentication, a cookie is used to persist the user's session, rather than re-submitting the `Authentication` header

The actual difference in your server code between the two approaches is not that large.

## Storing User Credentials

In either case, it is necessary for the server to be able to verify that the user's supplied credentials are correct. For most database-backed dynamic webservers, this is accomplished by having a _users_ table that stores the username, and an **encrypted** version of the password.  This encryption is usually accomplished through the use of a [cryptographic hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function).  This is a function that converts a string into a sequence of bytes that are very different from the source string.  It is also a function that is _extremely difficult to reverse_ i.e. it is difficult to figure out what the original string was from the hashed results.  

When authenticating the user, the password supplied by the user is hashed using the same function, and the resulting hash is compared to the one stored in the database.  If they match, the user is confirmed, and can be logged in.

The reason we store passwords only in this encrypted form is that if an adversary was able to compromise our database and obtain the _users_ table, they still wouldn't know the users' passwords.  Even with the contents of the database, the adversary would not be able to log in to our server as the user.  And, as most users use the same password and email for multiple sites, this gives them some additional protection.

In fact, current best practice is to do more than just encrypt the password - we also use salt and multiple hashing rounds.

### Salting a Password

Salting a password simply means to append a series of characters to the user's password before hashing it.  This helps avoid [rainbow table](https://en.wikipedia.org/wiki/Rainbow_table) attacks, where an adversary uses a list of prehashed commonly-used passwords.  Since many users adopt simple passwords like **1234**, **secret**, etc., it is a good bet that if you _do_ obtain a list of usernames and their hashed passwords, you can find some matches.  Appending the additional characters (usually in the form of random bytes) can prevent this.  For an even stronger approach, _two_ salts can be used - one stored as an server or environment variable, and one randomly generated per user and stored in the users table. Thus, the adversary would need to obtain access to both the database _and_ the source code or server environment, making attacks more difficult.

### Multiple Hashing Rounds

Unfortunately, computing hardware has advanced to the point that [brute force attacks](https://en.wikipedia.org/wiki/Brute-force_attack) have become more than plausible.  In a brute-force approach, permutations of characters are hashed until a match is found.  A cluster of off-the-shelf graphics cards can make as many as 350 billion guesses each second.  The defense against this approach is to make it take longer.  Encryption hash functions like [Bcrypt](https://en.wikipedia.org/wiki/Bcrypt) allow the hashing to be performed in multiple iterations.  Adding more iterations makes the encryption process take longer - and therefore slows down any brute-force attack replicating the hashing function.

The downside is that it takes longer to log a user in using this strategy, but it provides about the best protection that we as web developers can offer.  Incidentally, this is another reason to only authenticate the user once, rather than on every request (as is the case with HTTP authentication).  To be able to store the user's authentication however, we must maintain some form of session.

## User Sessions
This brings us to the second half of the username/password approach - we have to implement some form of user session. To do user sessions, we must also employ cookies. By their nature, cookies are not as secure as we might like, but there are some strategies we can use to make them more secure.  First, we should specify the cookies using the `Secure` and `HttpOnly` attributes, and the `SameSite` attribute set to `Strict`.  Moreover, the values set in the cookie should also be encrypted before being set (in this case, with a two-way encryption).  Commonly, only the session id or user id will be included in the cookie, while the actual session data will be stored server-side in memory or in a sessions table.

{{% notice warning %}}
As with HTTP Authentication (and indeed, all authentication approaches) password-based authentication should only be used with HTTPS connections.  
{{% /notice %}}