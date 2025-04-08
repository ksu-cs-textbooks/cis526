---
title: "Spring '25 Week 11"
weight: 20
pre: ""
---

{{< youtube vRq_Y0PqgPQ >}}

#### Video Script

Hello and welcome to the week 11 announcements video for CIS 526 and CC 515 in spring 2025. Over the weekend, I just published the materials for week 11 and week 12. So if you're at that point and caught up, you can get started on that. Week 11 is going to add authentication to our RESTful API. So we're going to add the ability to have background bypass authentication, as well as having CAS authentication, and we're going to add role-based authorization to our project as well. So it's a big change toward our backend. We're also going to add a lot of unit tests for that to make sure all of our authorization and authentication is working properly. 

And then for week 12, we're going to start working on a front end in view.js. And so I go through the same process that we did with Express of building a quick starter project in view that has a lot of the libraries and framework that I like to use. Once you get everything up and running for that project, you should end up with something like this. It looks very simple, but there's a lot going on here, especially if we open up the view inspector. You'll see that there's a lot of different components that make up this website, which is really, really powerful. So if I go here to my component map, you'll see that we've got a top menu with a menu bar that's hidden on it. We've got a router that's got a lot of stuff going on. And so there are many, many different parts to this app that we've built. We have a home page. We have an about page. Right now, the about page is just reading from the API versions. We have the ability to toggle between light and dark mode, and it will actually remember our selection. So if we refresh the page, it will load that from browser memory. 

And then, of course, we have a login process where we can go in and log in using the cast server that we're used to. And then once we log back in, it will actually take us directly to the login page. And for testing, we've created a profile page that will read all the users and roles from the back end, just so that we can see what that looks like. And I'm getting started on adding some additional buttons here on the menu, which is going to be the week 13 content. And so this is all pretty simple. Pretty straightforward, but it gets us a framework that we can work within to build the rest of the front end where we'll be able to manage the documents, the communities, and the metadata for those documents that we're going to have as part of our Lost Communities project. 

So that's where we're at so far. I'm going to be working with the TA over the next week or so to get caught up on the grading. I know we're a little bit behind on getting some of this new content graded, so bear with us. As always, if you have any questions, please post an end discussion or email us first and foremost. A lot of times if you have questions or concerns, we can address them in end discussion really quickly, but otherwise you're welcome to schedule a time to meet with me or with Josh and we're happy to help. Best of luck as you continue to work through this content and we will see you again next week. 

