# Priorities

Repairing/refactoring #:postcraft

In #:transmissions I have to be clearer about where processors get their instructions. I think this is what it should be, in descending order :

Properties in the :

1. `message` they receive
2. target `manifest.ttl`
3. application `config.ttl`
4. *sensible default TBD*

Right now I need it in `DirWalker`. It appears I've used `message.sourceDir` there before. Not ideal naming, but I get why - "sourceDir" will make sense in lots of other processors.

I have the following in node:
```javascript
{
"targetPath": "/home/danny/github-danny/postcraft/test-site",
"sourceDir": "content-raw",
"filename": "2025-01-08_hello-again.md",
"fullPath": "/home/danny/github-danny/postcraft/test-site/content-raw/entries/2025-01-08_hello-again.md",
```
 What's the best way to pull out the subdir path `entries`

 Ok, I believe I have this first part working.
