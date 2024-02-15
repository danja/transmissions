
export class Injectable {

  static services = []

  static injectInto(container) {

    this.services.forEach(serviceName => {
      this.prototype[serviceName] = container.getService(serviceName)
    })
  }
}

