Usage:
./trans

Available applications:
example-application
md-to-sparqlstore
pc-a2a
pc-mcp
postcraft
postcraft-statics
sparqlstore-to-html
sparqlstore-to-site-indexes
terrapack
trial

./trans [application][.subtask] [options] [target]}

Positionals:
application the application to run
target the target of the application

Options:
--help Show help [boolean]
--version Show version number [boolean]
-v, --verbose Enable verbose output [boolean]
-s, --silent Suppress all output [boolean]
-m, --message Input message as JSON [string]
-M, --module-directory directory containing modules [string]
-t, --test Run in test mode [boolean] [default: false]
-w, --web Start web interface [boolean]
-p, --port Port for web interface
[number] [default: 4200]
-e, --editor Launch the visual Transmissions editor
[boolean]
