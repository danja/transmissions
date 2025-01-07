I've introduced a bug somewhere such that the application `src/applications/postcraft-only-render` doesn't work correctly. The immediate issue seems to be that the `src/processors/fs/DirWalker.js` process isn't receiving the correct paths. These should come from the application-level settings in `src/applications/postcraft-only-render/config.ttl`, and/or the target supplied at the command line, eg.
```sh
./trans postcraft-only-render ../postcraft/danny.ayers.name
```
and/or the manifest found there `../postcraft/danny.ayers.name/manifest.ttl`.
There is also an underlying problem to fix, that the config interpretation is currently fairly hardcoded in `src/processors/rdf/ConfigMap.js`. This I'd like to be handled more declaratively such that it uses values from the config RDF somehow.
How do you suggest I proceed?
