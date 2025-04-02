use existing codebase patterns
conventions

# Job Overview
I would like to replace the `getProperty(property, fallback)` method in `src/processors/base/Processor.js` with `getValues(property, fallback)` so that multiple property values can be supported. This should return an array of values. If there is only one value, it should be an array containing the same as what `getProperty` currently provides.

# Procedure
To achieve this I would like to start with a step-by-step, test-driven refactoring. First functionality around `getProperty()`, `  getPropertyFromSettings()` etc. should be delegated to `src/processors/base/ProcessorSettings.js`. Then the `getValues(property, fallback)` method should be added to `src/processors/base/Processor.js`, delegating to `src/processors/base/ProcessorSettings.js`. Then a replacement for `getProperty()` should call `getValues()` returning the first value of the array (if it exists). Before every change a corresponding Jasmine test should be created.

# Example Functionality

Currently the `packer` application uses a `StringFilter` processor defined in `src/processors/text/StringFilter.js`.

The pipeline in `src/applications/packer/transmissions.ttl` includes this reference :
```turtle
:p20 a :StringFilter ;
    trn:settings :filterConfig .
```

There are corresponding settings in `src/applications/packer/config.ttl` :

```turtle
:filterConfig a :ConfigSet ;
    :settings :filterDefaults ;
    :includePatterns "*.txt,*.md,*.js,*.jsx,*.ts,*.tsx,*.json,*.html,*.css" ;
    :excludePatterns "node_modules/*,dist/*,build/*,.git/*" .
```

The behaviour on `:excludePatterns` here should remain exactly as it is now. But this alternative expression should be give the equivalent result :

```turtle
:filterConfig a :ConfigSet ;
    :settings :filterDefaults ;
    :includePatterns "*.txt,*.md,*.js,*.jsx,*.ts,*.tsx,*.json,*.html,*.css" ;
    :excludePattern "node_modules/*" ;
    :excludePattern "dist/*" ;
    :excludePattern "build/*" ;
    :excludePattern ".git/*" .
```

Now check project knowledge to see how things currently work. Then give a lot of thought about how the above can be achieved in a systematic fashion. Then create a list of necessary steps. After double-checking the list is consistent with the requirements start the necessary code changes. All code listings should be rendered as individual artifacts containing full source code with an appropriate title and the path of the target source file made clear.  

----

npm test -- tests/unit/ProcessorSettings.spec.js
