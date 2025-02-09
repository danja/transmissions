Intended behaviour is described below, the immediate problem is that the line :

```
~/github-danny/transmissions$ ./trans -v ~/github-danny/trans-apps/applications/test_module-load -m '{"first":"one","second":"two"}'
```

Attempts to load from `transmissions/src/applications/test_module-load/transmissions.ttl` when it should be loading data files from `trans-apps/applications/test_module-load`

`src/engine/ModuleLoader.js` isn't getting the correct path

---

Transmissions applications should be able to load modules from remote locations.

The source used here is under two independent file trees locally : `~/github-danny/transmissions` is the transmissions system, `~/github-danny/trans-apps` are applications which use it.

The transmission defined in `trans-apps/applications/module-load-test/transmissions.ttl` should first load the processors and configurations it needs and then run the pipeline.
The transmission first should read :
`trans-apps/applications/module-load-test/manifest.ttl`

With this transmission it should apply the values passed in the message to an instance of `Concat', loaded from `applications/test_module-load/processors/Concat.js`.

Here the values are passed from the command line :

Running from `~/github-danny/transmissions` :

```sh
./trans ../trans-apps/applications/test_module-load -m '{"first":"one","second":"two"}'
```

Current trace from `./trans -v ~/github-danny/trans-apps/applications/test_module-load -m '{"first":"one","second":"two"}'
` :

CommandUtils.begin, application = /home/danny/github-danny/trans-apps/applications/test_module-load
CommandUtils.begin, target = undefined
CommandUtils.begin, message = [object Object]

CommandUtils.splitName, fullPath = /home/danny/github-danny/trans-apps/applications/test_module-load

CommandUtils.splitName, parts = ,home,danny,github-danny,trans-apps,applications,test_module-load
CommandUtils.splitName, appName:test_module-load, appPath:/home/danny/github-danny/trans-apps/applications/test_module-load, task:false,

    after split :
    appName = test_module-load
    appPath = /home/danny/github-danny/trans-apps/applications/test_module-load
    subtask = undefined
    target = undefined

ApplicationManager.initialize, appName=test_module-load, appPath=/home/danny/github-danny/trans-apps/applications/test_module-load, subtask=undefined, target=undefined

ModuleLoaderFactory.createApplicationLoader called with /home/danny/github-danny/transmissions/src/applications/test_module-load/processors
ModuleLoaderFactory creating loader with paths:
App: /home/danny/github-danny/transmissions/src/applications/test_module-load/processors
Core: /home/danny/github-danny/transmissions/src/processors
ModuleLoader initialized with paths :
/home/danny/github-danny/transmissions/src/applications/test_module-load/processors,/home/danny/github-danny/transmissions/src/processors
ApplicationManager.start, transmissionsFile=/home/danny/github-danny/transmissions/src/applications/test_module-load/transmissions.ttl, configFile=/home/danny/github-danny/transmissions/src/applications/test_module-load/config.ttl, subtask=undefined
