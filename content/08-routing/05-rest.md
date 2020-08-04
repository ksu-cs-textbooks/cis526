---
title: "REST"
pre: "5. "
weight: 50
date: 2018-08-24T10:53:26-05:00
---

We've already seen that with our blog, we could convey which post to display with different URL strategies, i.e.:

* http://my-blog.com/posts?id=5
* http://my-blog.com/posts/5
* http://my-blog.com/posts/5-a-night-that-was-dark

And that is just to _display_ posts.  What about when we want our blog software to allow the writer to _submit_ new posts?  Or _edit_ existing ones?  That's a lot of different URLS we'll need to keep track of.

## Representational State Transfer (REST)

Roy Fielding tackled this issue in [Chapter 5](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) of his Ph.D. dissertation "Architectural Styles and the Design of Network-based Software Artchitectures."  He recognized that increasingly dynamic web servers were dealing with _resources_ that could be created, updated, read, and destroyed, much like the resources in database systems (not surprisingly, many of these resources were persistently stored in such a database system).  These operations are so pervasive in database systems that we have an acyronym for them: CRUD.

Roy mapped these CRUD methods to a HTTP URL + Method pattern he called **Re**presentational **S**tate **T**ransfer (or REST).  This pattern provided a well-defined way to express CRUD operations as HTTP requests.

Take our blog posts example.  The RESTful routes associated with posts would be:

<table>
  <tr>
    <th>URL</th>
    <th>HTTP Method</th>
    <th>CRUD Operation</th>
  </tr>
  <tr>
    <td>posts/</td>
    <td>GET</td>
    <td>Read (all)</td>
  </tr>
  <tr>
    <td>posts/:id</td>
    <td>GET</td>
    <td>Read (one)</td>
  </tr>
  <tr>
    <td>posts/</td>
    <td>POST</td>
    <td>Create</td>
  </tr>
  <tr>
    <td>posts/:id</td>
    <td>POST</td>
    <td>Update</td>
  </td>
  <tr>
    <td>posts/:id</td>
    <td>DELETE</td>
    <td>Delete</td>
  </tr>
</table>

The `:id` corresponds to an actual identifier of a specific resource - most often the `id` column in the database.  REST also accounts for nesting relationships.  Consider if we added _comments_ to our _posts_.  Comments would need to correspond to a specific post, so we'd nest the routes:

<table>
  <tr>
    <th>URL</th>
    <th>HTTP Method</th>
    <th>CRUD Operation</th>
  </tr>
  <tr>
    <td>posts/:post_id/comments</td>
    <td>GET</td>
    <td>Read (all)</td>
  </tr>
  <tr>
    <td>posts/:post_id/comments/:comment_id</td>
    <td>GET</td>
    <td>Read (one)</td>
  </tr>
  <tr>
    <td>posts/:post_id/comments</td>
    <td>POST</td>
    <td>Create</td>
  </tr>
  <tr>
    <td>posts/:post_id/comments/:comments_id</td>
    <td>POST</td>
    <td>Update</td>
  </td>
  <tr>
    <td>posts/:post_id/comments/:comments_id</td>
    <td>DELETE</td>
    <td>Delete</td>
  </tr>
</table>

Notice that we now have _two_ wildcards for most routes, one corresponding to the `post` and one to the `commment`.

If we didn't want to support an operation, for example, _updating_ comments, we could just omit that route.

REST was so strightforward and corresponded so well to how many web servers were operating, that it quickly became a widely adopted technique in the web world.  When you hear of a RESTful API or RESTful routes, we are referring to using this pattern in the URLs of a site.