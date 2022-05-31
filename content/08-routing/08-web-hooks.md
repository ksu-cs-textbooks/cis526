---
title: "Web Hooks"
pre: "8. "
weight: 80
date: 2018-08-24T10:53:26-05:00
---

A lighter-weight alternative to a full-fledged API is a [webhook](https://en.wikipedia.org/wiki/Webhook).  A webhook is simply an address a web application is instructed to make a HTTP request against when a specific event happens. For example, you can set your GitHub repository to trigger a webhook when a new commit is made to it.  You simply provide the URL it should send a request to, and it will send a request with a payload (based on the event).

For example, the Discord chat platform allows users to create [webhook endpoint](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) that will post messages into a channel. The webhook will be the in the form lf a URL that specifies the Discord server and channel that the message should be sent to, as well as some authentication parameters to identify the source of the webhook. You can then configure a webhook in GitHub which sends a message to the URL when a commit is made to GitHub. Now, each time a user pushes new data to GitHub, you'll be able to see a message in Discord.

A more advanced webhook endpoint can be used to trigger various actions, such as a continuous deployment routine. In that way, you can have a repository automatically deploy each time it is updated, simply through the use of webhooks!

In other words, a webhook is a technique for implementing event listeners using HTTP.  One web service (GitHub in the example) provides a way for you to specify an event listener defined in another web application by the route used to communicate with it.  This represents a looser coupling than a traditional API; if the request fails for any reason, it will not cause problems for the service that triggered it.  It also has the benefit of being event-driven, whereas to check for new data with an API, you would need to _poll_ (make a request to query) the API at regular intervals.