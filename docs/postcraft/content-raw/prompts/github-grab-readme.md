./trans ../trans-apps/applications/github-list-repos -P '{"github": {"name":"danja"}}'

The `GitHubList` process in the transmission is now producing :

```json
"payload": {
    "github": {
      "name": "danja",
      "repositories": [
        "2001",
        "aa-module",
        "abcjs",
        ...
```

The goal is now to take this, and with the subsequent processors defined in this transmission, carry out these operations :

For each repository (iterate with `JSONWalker`), do a HTTP GET on the corresponding README.md, with URLs based on the list in the message from `GitHubList` following the form :

```
https://raw.githubusercontent.com/danja/abcjs/refs/heads/main/README.md
```

Then using `FileWriter`, save the text retrieved each GET to file with `FileWriter` follwoing the pattern :

```
target_dir/2001_README.md
target_dir/abcjs_README.md
```

Here is the transmission, under `trans-apps/applications/github-list-repos/transmissions.ttl`

```turtle
:github_list_pipeline a trm:Pipeline ;
trm:pipe (:p10 :p20 :p30 :p40) .

:p10 a :GitHubList .
:p20 a :JSONWalker ;
     trm:configKey :repoConfig .
:p30 a :HttpGet .
:p40 a :FileWriter ;
     trm:configKey :repoFsConfig .
```

You will need to make a corresponding `trans-apps/applications/github-list-repos/processors-config.ttl`

Use examples like `transmissions/src/applications/claude-json-converter/processors-config.ttl` for reference.

Minor changes may be needed to `JSONWalker`, but keep these to a minimum, wherever possible make things declarative in `processors-config.ttl` so the processor modules are reusable.
