const Injectable = require('./Injectable')

class App extends Injectable {
  static services = ['emailLogging']
  run() {
    setInterval(() => {
      this.emailLogging.error('Haha made ya\' look!')
    }, 5000)
  }
}

module.exports = exports = App
