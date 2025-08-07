`src/apps/squirt/about.md`

# Squirt Application `about.md`

To begin the user will start the transmissions web server using `./trans -w`

The purpose of the Squirt app is to receive URLs when the web API is called from something like docs/squirt/bookmarklet.html 

The processor defined in src/processors/squirt/SquirtReceiver.js should be passed the URL, which it will add to its message
