---
title: "Server Pages"
pre: "3. "
weight: 30
date: 2018-08-24T10:53:26-05:00
---

The CGI scripting approach eventually evolved into a concept known as server pages and embodied in the technologies of PHP and Microsoft’s Active Server Pages (ASP), as well as Java Server Pages, and many other less-well-known technologies. While each of these use different scripting languages, the basic idea is the same: Take a traditional static webserver functionality, and couple it with a script interpreter. When most files are requested from the server, the file is served using the same techniques we used in the last chapter. But when a script file understood by our augmented server is requested, the script file is executed, and its output is sent as the response.

This may sound a lot like the CGI Scripts we discussed before, and it certainly is, except for two major innovations.   The first of these was that the same interpreter, and therefore OS process, could be used for all requests.  As server hardware adopted multiple CPUs and multi-core CPUs, additional interpreter processes were added, allowing incoming requests to be responded to concurrently on separate processors.  

### Embedded Scripts
The second big innovation innovation was the idea of embedding script _directly in HTML code_.  When the server page is interpreted, the embedded scripts would execute, and their output would be concatenated directly into the HTML that was being served.

For example, a PHP page might look like this:

```php
<!DOCTYPE html>
<html>
  <head><title>PHP Example</title></head>
  <body>
    <h1>A PHP Example</h1>
    <?php
      echo date('D, d M Y H:i:s');
    ?>
  </body>
</html>
```

Notice everything except the `<?php ... ?>` is perfectly standard HTML.  But when served by an [Apache server](https://httpd.apache.org/) with [mod_php](https://cwiki.apache.org/confluence/display/HTTPD/php) installed, the code within `<?php ... ?>` would be executed, and its output concatenated into the HTML that would then be served (the `echo` function prints output, and `date()` creates the current time in the specified format).  

Similarly, an ASP page doing the same task would look like:

```html
<!DOCTYPE html>
<html>
  <head><title>ASP Example</title></head>
  <body>
    <h1>An ASP Example</h1>
    <%
      Response.Write Now()
    %>
  </body>
</html>
```

These files would typically be saved with a special extension that the server would recognize, i.e. _.php_ for PHP files, and _.asp_ for ASP files.  Allowing scripts to be directly embedded within HTML made web development with these tools far faster, and as IDEs were adapted to support syntax highlighting, code completion, and other assistive features with these file types also helped prevent syntax errors in both the HTML and script code.

Active Server Pages and PHP remain commonly used technologies today, and a large portion of legacy websites built using them are still in service.  In fact, your personal web space on the CS department server is running in an Apache server set up to interpret PHP files - you could add a PHP script like the one above and and it would execute when you visited the page.  You can visit the support [Personal Web Pages](https://support.cs.ksu.edu/CISDocs/wiki/Personal_Web_Pages#Dynamic_Content) entry for details on doing so.

