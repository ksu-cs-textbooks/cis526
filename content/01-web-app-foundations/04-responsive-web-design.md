---
title: "Responsive Web Design"
pre: "4. "
weight: 40
date: 2018-08-24T10:53:26-05:00
---
Modern websites are displayed on a wide variety of devices, with screen sizes from 640x480 pixels (VGA resolution) to 3840x2160 pixels (4K resolution). It should be obvious therefore that one-size-fits-all approach to laying out web applications does not work well.  Instead, the current best practice is a technique known as [Responsive Web Design](https://en.wikipedia.org/wiki/Responsive_web_design).  When using this strategy your web app should automatically adjusts the layout of the page based on how large the device screen it is rendered on.

## Media Queries

Responsive web design is built around the concept of [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).  These allow CSS rules to be conditionally applied when the media device matches certain criteria.  For example, this CSS code will turn `<h1>` tags red when the width of the viewport is _exactly_ 400 pixels:

```css
@media (width: 400px) {
    h1 {
        color: red;
    }
}
```

The media query consists of:
1. The `@media` keyword
2. An optional media type (typically `screen`, but could also be `all`, `print`, and `speech`)
3. The desired media features surrounded by parentheses.  Multiple features can be joined by logical operators `and`, or logically or-ed using a `,`.  More advanced queries can use `not` to invert an expression (if using `not` you _must_ specify the media type).
4. A block of CSS surrounded by `{}` 

The most commonly used media features are `max-width`, `min-width`, `max-height`, `min-height`, and `orientation`. The sizes can be specified in any CSS unit of measurement, but typically `px` is used.  The `orientation` can either be `portrait` or `landscape`.

## The Viewport Meta Tag

The media query size features relate to the _viewport_, a rectangle representing the browser's visible area.  For a desktop browser, this is usually equivalent to the _client area_ of the browser window (the area of the window excluding the borders and menu bar).  For mobile devices, however, the viewport is often much bigger than the actual screen size, and then scaled to fit on the screen:

![The mobile viewport scaling strategy]({{<static "images/1.5.1.jpg">}})

This strategy helps legacy websites reasonably appear on mobile devices.  However, with responsive designs, we want the viewport and the device size to match exactly.  We can clue mobile browsers into this desire by adding a specific meta tag to the `<head>` of the HTML:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

For a responsive design to work, it is critical that this `<meta>` element be included, and use the exact syntax specified.

## Avanced CSS Layouts

Finally, responsive designs tend to make heavy use of two new CSS layout strategies - [The Flexible Box Module (flex)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) and the [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout).  These two layout tools allow for easily changing layouts within media queries - even allowing for the rearanging of elements!

Two great visual resources for learning the ins and outs of these layouts are CSS Trick's [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) and [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/).  In fact, you may want to bookmark these now.