---
title: "SQL Injection"
pre: "5. "
weight: 50
date: 2018-08-24T10:53:26-05:00
---
Along with the use of relational databases and SQL comes one very important attack to be aware of - SQL injection.  This attack takes advantage of the way many developers write SQL queries within their programs.  Consider the simple relational database we laid out earlier.  Let's assume our web application lets us search for people by thier last names.  To find Mary Cotts, we would then need a SQL query like:

```sql
SELECT * FROM people WHERE last='Cotts';
```

Since we want our _users_ to be able to specify who to look for, we'd probably give them a search form in our HTML, something like:

```html
<form>
    <label for="last">Last Name:</label>
    <input type="text" name="last">
    <input type="submit" value="Search">
</form>
```

And in our code, extract the `name` value from the query string and use it to construct the SQL query using string concatenation:

```js
const querystring = require('querystring');

var url = new URL(req.url, "http://localhost");
var qs = querystring.parse(url.search.slice(1));
var name = qs.name;

var query = `SELECT * FROM people WHERE last='${name}';`;
```

The problem with this approach is a savvy adversiary could submit a "name" that completes the SQL command and begins a new one, i.e.:

```text
bob'; UPDATE users SET admin=true WHERE username='saavyhacker
```

Our naive concatenation approach then creates _two_ SQL commands:

```SQL
SELECT * FROM people WHERE last='bob'; UPDATE users SET admin=true WHERE username='saavyhacker';
```

When we run this query, our savvy hacker just made themselves an admin on our site (assuming our database has a users table with an admin column we use to determine thier role)!

This is just the tip of the iceberg for SQL injection attacks - there are many, many variations on the theme.

## Preventing SQL Injection

Every database driver provides the ability to build parameterized queries, i.e. a preformatted query that has "slots" where you assign values to.  The exact mechanism to use these depends on the driver you are using to connect to the database.  For example, if we were using the [node-sqlite3]() driver to connect our Node application to a SQLite database, we would use:

```js
const querystring = require('querystring');

var url = new URL(req.url, "http://localhost");
var qs = querystring.parse(url.search.slice(1));
var name = qs.name;

var query = `SELECT * FROM people WHERE last=?;`;

// assuming a variable db is declared 
db.run(query, name, (err, result) => {
    // do something with result...
});
```

Because the slot corresponds to a specific column, the database engine converts the supplied arguement to that type before appplying it  In this case, if our canny hacker uses his string, it would be interpreted as the literal last name "bob'; UPDATE users SET admin=true WHERE username='saavyhacker". Which probably wouldn't exist in our database, because what kind of parent would saddle a child with such a name?

{{% notice note %}}
![XKCD's Exploits of a Mom](https://imgs.xkcd.com/comics/exploits_of_a_mom.png)
[XKCD's Exploits of a Mom](https://xkcd.com/327/)
{{% /notice %}}
