Intended behaviour is described below, the immediate problem is that the line :

```
~/hyperdata/transmissions$ ./trans -v ~/hyperdata/trans-apps/apps/test_module-load -m '{"first":"one","second":"two"}'
```

Attempts to load from `transmissions/src/apps/test_module-load/transmissions.ttl` when it should be loading data files from `trans-apps/apps/test_module-load`

`src/engine/ModuleLoader.js` isn't getting the correct path

---

Transmissions apps can load modules from remote locations.

The source used here is under two independent file trees locally : `~/hyperdata/transmissions` is the transmissions system, `~/hyperdata/trans-apps` are apps which use it.

The transmission defined in `trans-apps/apps/module-load-test/transmissions.ttl` should first load the processors and configurations it needs and then run the pipeline.
The transmission first should read :
`trans-apps/apps/module-load-test/manifest.ttl`

With this transmission it should apply the values passed in the message to an instance of `Concat', loaded from `apps/test_module-load/processors/ConCat.js`.

Here the values are passed from the command line :

Running from `~/hyperdata/transmissions` :

```sh
./trans ../trans-apps/apps/test_module-load -m '{"first":"TEST","second":"_PASSED"}'
```

Current trace from `./trans -v ~/hyperdata/trans-apps/apps/test_module-load -m '{"first":"one","second":"two"}'
` :

 *** CommandUtils ***
            this =  
     {"options":{"_":[],
      "v":true,
      "verbose":true,
      "m":"{\"first\":\"one\",
      \"second\":\"two\"}",
      "message":"{\"first\":\"one\",
      \"second\":\"two\"}",
      "test":false,
      "t":false,
      "port":4500,
      "p":4500,
      "repl":false,
      "r":false,
      "$0":"src/api/cli/run.js",
      "app":"/home/danny/hyperdata/trans-apps/apps/test_module-load"}}
CommandUtils.handleOptions, pre-split, options.app = /home/danny/hyperdata/trans-apps/apps/test_module-load
CommandUtils.parseAppArg, appArg = /home/danny/hyperdata/trans-apps/apps/test_module-load
CommandUtils.parseAppArg appArg = /home/danny/hyperdata/trans-apps/apps/test_module-load
Path parts: ,home,danny,hyperdata,trans-apps,apps,test_module-load
Full path: appName:test_module-load, appPath:/home/danny/hyperdata/trans-apps/apps/test_module-load, subtask:false
CommandUtils.handleOptions, post-split, appName = test_module-load, appPath = /home/danny/hyperdata/trans-apps/apps/test_module-load, subtask = false

AppManager.initApp
/home/danny/hyperdata/transmissions/src/apps
APP PATH = test_module-load
