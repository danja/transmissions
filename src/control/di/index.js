// Create the dependency injector instance for the application
const DI = require('./DependencyInjector')
const di = new DI()

// Now, create the instance of our application using the DI to inject services
const App = di.make(require('./App'))
const app = new App() // Has access to the emailLogging service

app.run();
