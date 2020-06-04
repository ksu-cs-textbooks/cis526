---
title: "JSON"
pre: "10. "
weight: 100
date: 2018-08-24T10:53:26-05:00
---

JSON is an acronym for _JavaScript Object Notation_, a serialization format that was developed in conjunction with ECMAScript 3.  It is a standard format, as set by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). 

## JSON Format
Essentially, it is a format for transmitting JavaScript objects.  Consider the JavaScript object literal notation:

```js
var whilma = {
  name: "Wilma Flintstone",
  relationship: "wife"
}
var pebbles = {
  name: "Pebbles Flintstone",
  age: 3,
  relationship: "daughter"
}
var fred = {
  name: "Fred Flintstone",
  job: "Quarry Worker",
  payRate: 8,
  dependents: [whilma, pebbles]
}
```

If we were to express the same object in JSON:

```json
{
  "name": "Fred Flintstone",
  "job": "Quarry Worker",
  "payRate": 8,
  "dependents": [
    {
      "name": "Wilma Flintstone",
      "relationship": "wife"
    },
    {
      "name": "Pebbles Flintstone",
      "age": 3,
      "relationship": "daughter"
    }
  ]
}
```

As you probably notice, the two are very similar.  Two differences probably stand out: First, references (like whilma and pebbles) are replaced with a JSON representation of their values.  And second, all property names (the keys) are expressed as strings, not JavaScript symbols.

A discussion of the full syntax can be found in the [MDN Documenation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) and also at [json.org](https://json.org/).

## The JSON Object

The JavaScript langauge provides a JSON object with two very useful functions: [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).  The first converts any JavaScript variable into a JSON string.  Similarly, the second method parses a JSON string and returns what it represents.

## JSON and Other Languages

While JSON was developed in conjunction with JavaScript, it has become a popular exchange format for other languages as well.  There are parsing libraries for most major programming languages that can convert JSON strings into native objects:

* [Java](https://www.oracle.com/technetwork/articles/java/json-1973242.html)
* [C#](https://docs.microsoft.com/en-us/dotnet/framework/wcf/feature-details/how-to-serialize-and-deserialize-json-data)
* [Python](https://docs.python.org/3/library/json.html)
* [C](https://github.com/json-c/json-c)
* [C++](https://github.com/nlohmann/json)

Some (like the Python one) are core language features.  Others are open-source projects.  There are many more available, just search the web!
