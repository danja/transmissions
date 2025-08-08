we need the following :

src/api/watch/watch-config.json : contains details of directories that should be watched for changes, grouped in sets, each with associated named apps, eg.

```json
[
    {
        "name":"postcraft-render",
        "dirs":[
            "~/sites/danny.ayers.name/postcraft",
            "~/hyperdata/hyperdata/docs/postcraft",
            "~/hyperdata/transmissions/docs/postcraft",
            "~/hyperdata/semem/docs/postcraft"
        ],
        "apps":[
            "md-to-store",
            "store-to-html",
            "store-to-site-indexes"
        ]     
    }
]
```
This will be read by src/api/watch/WatchConfig.js module
A long-running node module src/api/watch/Watch.js will attach watches to the dirs.
When any file in the watched dirs changes, a sequence of calls to apps will be made, corresponding to :
```sh
./trans md-to-store ~/sites/danny.ayers.name/postcraft
./trans store-to-html ~/sites/danny.ayers.name/postcraft
./trans store-to-site-indexes ~/sites/danny.ayers.name/postcraft
./trans md-to-store ~/hyperdata/hyperdata/docs/postcraft
...
```

