---
title: "Databases"
pre: "3. "
weight: 30
date: 2018-08-24T10:53:26-05:00
---

As we suggested in the previous section, using an already existing database application is a very common strategy for full-stack web development.  Doing so has clear benefits - such programs are typically stable, secure, and optimized for data storage and retrieval. They are well beyond what we can achieve ourselves without a significant investment of time, and avoids the necessity of "reinventing the wheel".

That said, making effective use of a third-party database system _does_ require you to develop familiarity with how the database operates and is organized. Gaining the benefits of a database's optimizations requires structuring your data in the way its developers anticipated, and likewise retrieving it in such a manner.  The exact details involved vary between database systems and are beyond the scope of this course, which is why you have a database course in your required curriculum.  Here I will just introduce the details of how to integrate the use of a database into your web development efforts, and I'll leave the learning of how to best optimize your database structure and queries for that course.

In the web development world, we primarily work with two kinds of databases, which have a very different conceptual starting point that determines their structure.  These are [Relational Databases](https://en.wikipedia.org/wiki/Relational_database) and [Document-oriented Databases](https://en.wikipedia.org/wiki/Document-oriented_database) (sometimes called No-SQL databases).  There is a third category, [Object-oriented Databases](https://en.wikipedia.org/wiki/Object_database) that are not widely adopted, and a slew of less-well known and utilized technologies.  There are also cloud services that take over the role traditionally filled by databases, which we'll save for a later chapter.  For now, we'll focus on the first two, as these are the most commonly adopted in the web development industry.
