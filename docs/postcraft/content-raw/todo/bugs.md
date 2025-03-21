# Transmissions Known Bugs

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
