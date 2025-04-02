# Re-Rendering Claude Chat JSON Data

I'm using Claude's Projects a *lot*, and have been attempting to keep projects distinct. But I hop around between them, and leave many threads in-progress, it's got very difficult to find things. But a JSON export is available.

What I'd like is `converstations.json` rendered on the fs something like :

```
> ROOT
  meta_r.ttl
    > PROJECT1
      meta_p1.ttl
      > SESSION1
        meta_s1.ttl
        text1.md
        text2.md
        ...
      > SESSION2
        ...
    > PROJECT2
   ...
```

*I started building the #:transmission for these as an application away from the core [transmissions repo](https://github.com/danja/transmissions), over in [trans-apps](https://github.com/danja/trans-apps). But got in a tangle with paths in `ModuleLoader`, so reverted to putting it in the core for now. One problem at a time...*

Last night I got the #:transmission this far (very hackily) :
```turtle
:cjc a trm:Pipeline ;

trm:pipe (:p10 :p30 :p40) .

:p10 a :JSONWalker .
:p20 a :Unfork .
:p30 a :MarkdownFormatter .
:p40 a :FileWriter .
```
This is run from:
```sh
./trans claude-json-converter -P ./conversations.json
```

`JSONWalker` runs through the list of top level elements, spawning a new pipe for each. I had `Unfork` in there so I could look at one in isolation. So far so good. But I now need it to split each of these. `JSONWalker` again (it's only going to handle one layer, maybe rename..?). But different config. Right now all that's hardcoded, it should go in `processors-config.ttl`.

Hmm, first the target *ROOT* dir. That should already be doable from the CLI:
```sh
./trans claude-json-converter -P ./conversations.json target_root
```
to check (`:SM` = Show Message) :
```turtle
:cjc_test a trm:Pipeline ;
trm:pipe (:SM ) .
```

Boo! The message includes :
```
"dataDir": "src/applications/claude-json-converter/data",
"rootDir": "target_dir",
"applicationRootDir": "target_dir",
```
Messed up from my module-loading efforts. Ok, for now I'll put it in `processors-config.ttl`.
```turtle
t:TopConfig a trm:ServiceConfig ;
    trm:key t:topConfig ;
    trm:targetDir "claude-chat" .
```

for:
```turtle
:p10 a :JSONWalker ;
     trm:configKey :topConfig .
```

So, `ShowConfig`:
```turtle
:cjc_test a trm:Pipeline ;
trm:pipe (:SC) .
```

Hah! Fool danny. I'd completely forgotten how I'd set up access to the config. Even then it's very *work-in-progress*. But this worked well enough for now :
```javascript
logger.debug(`JSONWalker: using configKey ${this.configKey.value}`)
const targetDir = this.getPropertyFromMyConfig(ns.trm.targetDir)
logger.debug(`JSONWalker:targetDir =  ${targetDir}`)
```

Next, how does `FileWriter` work..?

./trans ../trans-apps/applications/github-list-repos -P '{"github": {"name":"danja"}}'
