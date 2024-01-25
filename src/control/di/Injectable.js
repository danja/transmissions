class Injectable {
  static services = []

  static __inject(container) {
    this.services.forEach(serviceName => {
      this.prototype[serviceName] = container.getService(serviceName)
    }
  }
}

module.exports = exports = Injectable
