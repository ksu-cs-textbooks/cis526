---
title: "Relational Databases"
pre: "4. "
weight: 40
date: 2018-08-24T10:53:26-05:00
---

Relational databases (also called SQL databases) provide a highly-structured storage mechanism.  Data is organized into _tables_, with each column representing a single value and data type, and each row representing one entry.  Conceptually, this organization is similar to tables you have seen in Excel and on the web.  An example _persons_ table is listed below:

<table>
  <thead>
    <tr>
      <th>id</th>
      <th>First</th>
      <th>Last</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>Lisa</td>
      <td>Merkowsky</td>
    </tr>
    <tr>
      <td>1</td>
      <td>Frank</td>
      <td>Stiles</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Mary</td>
      <td>Cotts</td>
    </tr>
  </tbody>
</table>

Relational databases are often called SQL databases as we use _Structured Query Language (SQL)_ to communicate with them.  This is a domain-specific langauge similar to the LINQ you learned about in CIS 400 (actually, LINQ derives much of its syntax from SQL).  Queries are streamed to a relational database across a socket or other connection, much like HTTP requests and responses are.  The response is recieved also as text which must be parsed to be used.

SQL is used to contruct the structure of the database.  For example, we could create the above table with the SQL command:

```sql 
CREATE TABLE persons (
    id PRIMARY KEY,
    Last TEXT,
    First TEXT,
);
```

SQL is also used to _query_ the database.  For example, to find all people with the last name "Smith", we would use the query:

```sql
SELECT * FROM persons WHERE last='Smith';
```

You will learn more about writing SQL queries in the CIS 580 course.  You can also find an excellent guide on [W3C schools](https://www.w3schools.com/sql/), with interactive tutorials.  We'll breifly cover some of the most important aspects of relational databases for web developers here, but you would be wise to seek out additional learning opportunities.  Understanding relational databases well can make a great deal of difference in how performant your web applications are.

The key to performance in relational databases is the use of _keys_ and _indices_.  A key is a column whose values are unique (not allowed to be repeated).  For example, the `id` column in the table above is a key.  Specifically, it is a sequential primary key - for each row we add to the table it increases, and its value is determined by the database.  Note the jump from `1` to `3` - there is no garuntee the keys will always be exactly one more than the previous one (though it commonly is), and if we delete rows from a table, the keys remain the same.  

### Indices
An index is a specialized data structure that makes searching for data faster.  Consider the above table.  If we wanted to find all people with the last name "Smith", we'd need to interate over each row, looking for "Smith".  That is a linear **O(n)** complexity.  It would work quickly in our example, but when our table has thousands or millions of rows (not uncommon for large web apps), it would be painfully slow.

Remember learning about dictonaries or hash tables in your data structures course?  The lookup time for one of those structures is constant **O(1)**.  Indices work like this - we create a specialized data structure that can provide the index we are looking for, i.e. an index built on the `Last` column would map `last => id`.  Then we could retrieve all "Smith" last names from this structure in constant time **O(1)**.  Since we know the primary key is unique and ordered, we can use some kind of divide-and-conquer search strategy to find all rows with a primary key in our set of matches, with a complexity of **O(n*log(n))**.  Thus, the complete lookup would be **O(n*log(n)) + O(1)**, which we would simplify to **O(n*log(n)**, much faster for a large **n** than **O(n)**.  

{{% notice info %}}
In truth, most SQL databases use [Balanced Trees (B-Trees)](https://en.wikipedia.org/wiki/B-tree) for thier indices; but the exact data structure is unimportant to us as web developers, as long as retrieval is efficient.
{{% /notice %}}

We can create an index using SQL.  For example, to create an index on the column `last` in our example, we would use:

```sql
CREATE INDEX last_index ON persons (last);
```

An index can involve more than one row - for example, if we expected to search by both first and last name, we'd probably create an index that used both as the key. The SQL to do so for both first and last names would be:

```sql
CREATE INDEX both_names ON persons (last, first);
```

Each index effectively creates a new data structure consuming additional memory, so you should consider which indices are really necessary.  Any column or column you frequently look up values by (i.e. are part of the WHERE clause of a query) should be indexed.  Columns that are only rarely or never used this way should not be included in indices. 

### Relationships
The second important idea behind a relational database is that we can define realtionships _between_ tables.  Let's add a second table to our example, _addresses_:

<table>
  <thead>
    <tr>
      <th>id</th>
      <th>person_id</th>
      <th>street</th>
      <th>city</th>
      <th>state</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>Anderson Ave.</td>
      <td>Manhattan</td>
      <td>KS</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>Sesame St.</td>
      <td>Baltimore</td>
      <td>ML</td>
    </tr>
    <tr>
      <td>2</td>
      <td>1</td>
      <td>Moholland Dr.</td>
      <td>Hollywood</td>
      <td>CA</td>
    </tr>
    <tr>
      <td>3</td>
      <td>3</td>
      <td>Cooper Street</td>
      <td>Silver City</td>
      <td>NM</td>
    </tr>
  </tbody>
</table>

Here `person_id` is a _foriegn key_, and corresponds to the `id` in the _persons_ table.  Thus, we can look up the address of Lisa Merkowsky by her `id` of 0.  The row in the _addresses_ table with the value of 0 for `person_id` is "Anderson Ave., Manhattan KS". 

Note too that it is possible for one row in one table to correspond to more than one row in another - in this example Frank Styles has _two_ addresses, one in Baltimore and one in Hollywood.

If one row in one table correponds to a single row in another table, we often call this a _one-to-one_ relationship.  If one row corresponds to more than one row in another table, we call this a _one-to-many_ relationship.  We retrieve these values using a query with a JOIN clause, i.e. to get each person with thier addresses, we might use:

```sql
SELECT last, first, street, city, state FROM persons LEFT JOIN addresses ON persons.id = addresses.person_id;
```

The result will also be structured as a table with columns `last`, `first`, `street`, `city`, and `state` containing a row for each person.  Actually, there will be _two_ rows for Frank, one containing each of his two addresses.

Finally, it is possible to have a _many-to-many_ relationship, which requires a special table to sit in between the two called a _join_ table.  Consider if we had a _jobs_ table:

<table>
  <thead>
    <tr>
      <th>id</th>
      <th>name</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>Doctor</td>
      <td>A qualified practitioner of medicine; a physician.</td>
    </tr>
    <tr>
      <td>1</td>
      <td>Lawyer</td>
      <td>A person who practices or studies law; an attorney or a counselor.</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Producer</td>
      <td>A person responsible for the financial and managerial aspects of making of a movie or broadcast or for staging a play, opera, etc.</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Detective</td>
      <td>A person, especially a police officer, whose occupation is to investigate and solve crimes.</td>
    </tr>
  </tbody>
</table>
(definitions provided by Oxford Languages)
 
Because more than one person can have the same job, and we might want to look up people by thier jobs, or a list of jobs that a specific person has, we would need a join table to connect the two.  This could be named _persons_jobs_ and would have a foreign key to both:

<table>
  <thead>
    <tr>
      <th>id</th>
      <th>person_id</th>
      <th>job_id</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <td>0</td>
      <td>2</td>
      <td>2</td>
    </tr>
    <tr>
      <td>0</td>
      <td>3</td>
      <td>1</td>
    </tr>
    <tr>
      <td>0</td>
      <td>3</td>
      <td>3</td>
    </tr>
  </tbody>
</table>

Thus Lisa is a doctor, Frank a producer, and Mary is both a doctor and detective!  We could query for every doctor using a SQL statement with two joins, i.e.:

```SQL
SELECT first, last 
FROM jobs 
LEFT JOIN persons_jobs ON jobs.id = persons_jobs.job_id
LEFT JOIN persons ON jobs_persons.person_id = person.id
WHERE jobs.name = 'Doctor';
```

As suggested before, this is just scraping the surface of relational databases.  You'll definitely want to spend more time studying them, as they remain the most common form of persistent storage used on the web and in other industries as well. 
