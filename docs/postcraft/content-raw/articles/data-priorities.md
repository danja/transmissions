# Priorities

Repairing/refactoring #:postcraft

In #:transmissions I have to be clearer about where processors get their instructions. I think this is what it should be, in descending order :

Properties in the :

1. `message` they receive
2. target `manifest.ttl`
3. application `config.ttl`
4. *sensible default TBD*

Right now I need it in `DirWalker`. It appears I've used `message.sourceDir` there before. Not ideal naming, but I get why - "sourceDir" will make sense in lots of other processors.


```javascript
import ns from '../../utils/ns.js'
...

var templateFilename = this.getProperty(ns.trm.templateFilename)
```

need to check :
```
"targetPath": "/home/danny/github-danny/postcraft/test-site",
```
