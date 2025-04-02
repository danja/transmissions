# Transmissions Known Bugs

:ForEach / :Restructure remove might be broken

* check       const values = this.getValues(ns.trn.items)

* maybe move `workingDir` up into processor.app
**RUN TESTS!!!**

When a settings field wasn't associated with a `:FileWriter` it picked up an unrelated one from the manifest

#### Fixed ?

import Application from '../engine/AppResolver.js'

class ApplicationManager {
    constructor() {
        this.app = new Application()
        this.moduleLoader = null
        this.dataset = rdf.dataset()
    }
