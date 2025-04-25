// TODO is needed?
import { Readable } from 'readable-stream'

// Browser-compatible stream implementation
class BrowserReadable extends Readable {
    constructor(data) {
        super()
        this.data = data
        this.pushed = false
    }

    _read() {
        if (!this.pushed) {
            this.push(this.data)
            this.push(null)
            this.pushed = true
        }
    }
}