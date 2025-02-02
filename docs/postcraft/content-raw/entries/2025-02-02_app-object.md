# Application Objects

There are fields used in the creation of applications and passed along in messages that would be better stored in a broader scope. I'd like to encapsulate the fields in `src/engine/Application.js`.

I think most of the relevant fields are used in `src/engine/ApplicationManager.js` :

```sh
class ApplicationManager {
    constructor() {
        this.appsDir = 'src/applications'
        this.transmissionFilename = 'transmissions.ttl'
        this.configFilename = 'config.ttl'
        this.moduleSubDir = 'processors'
        this.dataSubDir = 'data'
        this.manifestFilename = 'manifest.ttl'
    }
    ...
     async initialize(appName, appPath, subtask, target, flags) {
```

When a transmission is running a message may contain the fields : "appName", "appPath", "subtask", "rootDir", "dataDir", "targetPath"

The refactoring will be done in the following steps :
1. review the code to find current fields that are appropriate to associate with an `Application` class, noting how they are modified in the program flow
2. create tests to check expected field values at appropriate points
2. extend `src/engine/Application.js` to support the fields, give them sensible defaults
3. review the code to find locations where the current fields are accessed and add an instance of `Application`
4. follow the current field access statements with their equivalents using the `Application` instance
5. test
6. bugfix

To get started I'd like artifacts from you : your summary of tasks; a revision of `src/engine/Application.js` including full source code; a list of filepaths to affected code with the changes necessary at each point; tests.

--------
## NEXT

new repomix, session

I get a failure in this :
```sh
npm test -- tests/integration/application-manager.spec.js
```
1) ApplicationManager Integration message processing should propagate application context in messages
  - AssertionError: expected undefined to equal 'test_app_manager'

...

pass a ref to the app to each transmission


src/engine/TransmissionBuilder.js:
- Access application context through passed message
- Use app.dataset for RDF operations

src/processors/base/Processor.js:
- Access application context through message
- Use app paths for file operations

add the app properties to config - make graph in ApplicationManager? merge

<echo> a :Application .

<this> a :ApplicationSession ;
    :application <echo> ;
    :config <config> .
