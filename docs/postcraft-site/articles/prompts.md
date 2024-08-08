## Service Creation

```prompt
Create a service `src/services/text/StringReplace.js` of the same form as `src/services/text/StringFilter.js` that will receive a message object containing strings `message.content`, `message.match` and `message.replace`. It will replace every substring of `message.content` that exactly matches `message.match` with `message.replace`.
Once created, apply the instructions in service-comment-prompt to it.
```

## Service Comment

```prompt
Apply the instructions in service-comment-prompt to the code below.
---
```

## Service Unit Tests

```prompt
A file containing a set of unit tests if required for the StringFilter service `src/services/text/StringFilter.js`. The aim is to compare StringFilter's behaviour with the required rules.

Follow the following steps to create this :

1. Use `tests/unit/NOP.spec.js` as a model and create `tests/unit/StringFilter.spec.js`

2. Then create three objects as follows:
  * content-samples : this should contain 10 simulated filesystem paths following posix conventions. 5 should be directories and 5 files. Vary their shape to cover most common patterns. In addition include an empty string and an undefined value
  * pattern-samples : create 5 glob-like string patterns plus 5 lists of string patterns suitable for use with StringFilter. In addition include an empty string pattern, an empty list and an undefined value.


3. Create a helper method compose() which will take values from content-samples and pattern-samples in a variety of combinations and compose these as objects of the form :
message = { content : contentValues, include: patternValues, exclude: patternValues}

4. Create describe() blocks that retrieve message values from compose() and send them to the isAccepted() method of an instance of StringFilter, comparing the return values with those determined by the rules as defined in docs/postcraft-site/articles/service_string-filter.md

```

```

---

Create RDF for `applications/postcraft-init/transmission.ttl` and `applications/postcraft-init/services.ttl` using the `FileCopy` service such that when the transmission is built and executed with:
`./run postcraft-init /absolute/path`
all the contents of `/home/danny/HKMS/postcraft/postcraft-template/` will be copied to `/absolute/path`

```

```

```
