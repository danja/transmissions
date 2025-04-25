/**
   * Mock dataset for browser environment
   */
class MockDataset {
    constructor() {
        this.quads = []
        this.size = 0
    }

    add(quad) {
        this.quads.push(quad)
        this.size++
        return this
    }

    addAll(quads) {
        this.quads = this.quads.concat(quads)
        this.size = this.quads.length
        return this
    }

    toStream() {
        return {
            on: (event, callback) => {
                if (event === 'data') {
                    this.quads.forEach(quad => callback(quad))
                }
                if (event === 'end') {
                    callback()
                }
                return this
            }
        pipe: () => this
        }
    }
}