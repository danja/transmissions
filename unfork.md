SyntaxError: Unexpected token '.', "./conversations.json" is not valid JSON
    at JSON.parse (<anonymous>)
    at CommandUtils.parseOrLoadContext (file:///home/danny/github-danny/transmissions/src/api/CommandUtils.js:82:28)
    at Object.handler (file:///home/danny/github-danny/transmissions/run.js:55:46)
    at file:///home/danny/github-danny/transmissions/node_modules/yargs/build/lib/command.js:206:54
    at maybeAsyncResult (file:///home/danny/github-danny/transmissions/node_modules/yargs/build/lib/utils/maybe-async-result.js:9:15)
    at CommandInstance.handleValidationAndGetResult (file:///home/danny/github-danny/transmissions/node_modules/yargs/build/lib/command.js:205:25)
    at CommandInstance.applyMiddlewareAndGetResult (file:///home/danny/github-danny/transmissions/node_modules/yargs/build/lib/command.js:245:20)
    at CommandInstance.runCommand (file:///home/danny/github-danny/transmissions/node_modules/yargs/build/lib/command.js:128:20)
    at [runYargsParserAndExecuteCommands] (file:///home/danny/github-danny/transmissions/node_modules/yargs/build/lib/yargs-factory.js:1412:93)
    at YargsInstance.parse (file:///home/danny/github-danny/transmissions/node_modules/yargs/build/lib/yargs-factory.js:707:63)
 api.logger debug

CommandUtils.run()
CommandUtils.run, process.cwd() = /home/danny/github-danny/transmissions
CommandUtils.run, application = claude-json-converter
CommandUtils.run, target = undefined
CommandUtils.run, normalizedAppPath = claude-json-converter
appName = claude-json-converter
CommandUtils.run, transmissionsDir = src/applications/claude-json-converter
CommandUtils.run,  normalizedAppPath = claude-json-converter
appPath = src/applications/claude-json-converter
config.modulePath = src/applications/claude-json-converter/processors
Creating ModuleLoader with paths:
ModuleLoader initialized with paths:

TransmissionRunner.run()
transmissionsFile =
processorsConfigFile =

+ ***** Construct Transmission :  <http://hyperdata.it/transmissions/cjc>
| Create processor :p10 of type :JSONWalker
| Create processor :p20 of type :Unfork
| Create processor :p30 of type :MarkdownFormatter
| Create processor :SM of type :ShowMessage
  > Connect #0 [p10] => [p20]
Transmission.connect from http://hyperdata.it/transmissions/p10 to http://hyperdata.it/transmissions/p10
Connector.connect this.fromName = http://hyperdata.it/transmissions/p10 this.toName =  http://hyperdata.it/transmissions/p20
  > Connect #1 [p20] => [p30]
Transmission.connect from http://hyperdata.it/transmissions/p20 to http://hyperdata.it/transmissions/p20
Connector.connect this.fromName = http://hyperdata.it/transmissions/p20 this.toName =  http://hyperdata.it/transmissions/p30
  > Connect #2 [p30] => [SM]
Transmission.connect from http://hyperdata.it/transmissions/p30 to http://hyperdata.it/transmissions/p30
Connector.connect this.fromName = http://hyperdata.it/transmissions/p30 this.toName =  http://hyperdata.it/transmissions/SM

+ ***** Execute Transmission :  <http://hyperdata.it/transmissions/cjc>
| Running : http://hyperdata.it/transmissions/p10 a JSONWalker
| Running :  (p10) p20 a Unfork
 - Unfork terminating pipe
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
| Running :  (p10) p20 a Unfork
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork terminating pipe
 - Unfork passing message
| Running :  (p10.p20) p30 a MarkdownFormatter
| Running :  (p10.p20.p30) SM a ShowMessage
***************************
***  Message
Instance of Object with properties - 
{
  "content": "# Untitled\n\n## 0\n\n{\n  \"uuid\": \"de1f3f67-e312-43c0-a5db-27b9cc7569aa\",\n  \"name\": \"Integrating StoneRD...",
  "targetFile": "undefined.md",
  "tags": "SM"
}
***************************
0
