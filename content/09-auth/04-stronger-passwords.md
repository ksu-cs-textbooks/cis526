---
title: "Stronger Passwords"
pre: "4. "
weight: 40
date: 2018-08-24T10:53:26-05:00
---

Now that we've discussed how to build a password-based authentication system as securely as possible, we should take a moment to understand what _makes a good password_. While we can't force users to use good passwords, we can encourage them to do so, and potentially build some requirements/guidance into our sign up forms.

You've likely been told multiple times that a good password is a mix of numbers, upper- and lower-case letters, and special symbols.  While this is indeed marginally better than a password of the same length that uses only letters, it isn't much.  Remember that with some clever programming and a graphics card, passwords can be brute-forced.  The amount of time this takes is more dependent on the _length_ of the password than the combination of characters.  This XKCD comic sums up the issue succinctly:

![XKCD: Password Strength](https://imgs.xkcd.com/comics/password_strength.png)

In short, the best passwords are actually _pass phrases_ - a combination of words that is easy to remember and of significant length.  Given this is mathematically demonstrable, why do so many authentication services insist on a complex scheme for making short passwords?  I suspect it is a legacy from when storage space was at a premium, as well as a nod to database performance.  

Think back to our SQL discussions - we can declare text in two ways - a VARCHAR (which has a set maximum length), or TEXT (which can be any size).  These roughly correspond to _value_ and _reference_ types in a programming language - VARCHARS are stored inline with table data, while TEXT entries are stored separately, and an address of their location is stored in the table.  If we're retrieving thousands or millions of rows including TEXT values, we have to pull those values from their disparate locations - adding overhead to the query.  VARCHARS we get with the row for no extra time cost.  So storing passwords as a VARCHAR would give better performance, and limiting them to a small size (by imposing a character limit) would save on storage requirements.

In the modern web, with storage costs as low as they are, there is no excuse for clinging to short passwords with arcane requriements.  If you are going to force your users to meet any rules for your password system, it should be a _minimum length_.

Or, we can side-step the issue entirely, by passing responsiblity for authentication to a third party.  We'll look at these strategies next.