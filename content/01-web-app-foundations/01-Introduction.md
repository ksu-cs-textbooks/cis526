---
title: "Introduction"
pre: "1. "
weight: 10
date: 2018-08-24T10:53:26-05:00
---
At this point, you should be familiar with the big three technologies of the world-wide-web _HTML_, _CSS_, and _JavaScript_ (Feel free to visit the appendices for a quick review).  These three technologies work together to create the web pages you interact with every day.  Each has a role to play in defining the final appearance of a web page:

* Hyper-Text Markup Language (HTML) provides the struture and content 
* Cascading Style Sheets (CSS) determine how that content should appear visually
* JavaScript provides interactivity, allowing both the structure and appearance of the page to change dynamically

We often refer to this division of responsiblity as the _separation of concerns_.  By placing all responsibility for appearance on a CSS file, we can refresh the look of a web application simply by replacing the old CSS file with a new one.  Similarly, we can create a new page in our site that looks and feels like the rest of the site by creating a new HTML page that links to the site's existing CSS files.

While you have written HTML, CSS, and JavaScript files in your prior learning experiences, you might not have thought about just how these files are processed, and those styling rules applied.  In this chapter we will explore this topic in detail, while introducing some more advanced uses for each.