# HTTP API clients

Usage:

1. Start the web server with the echo application (port 4500):
```sh
  ./trans -w echo
```
2. Test with curl:
```sh
  examples/http/echo-curl.sh
```

3. Test with Node.js:
```sh
  node examples/http/echo-node.js
```

4. Test graceful shutdown:
```sh
  examples/http/stop-curl.sh
  # or
  node examples/http/stop-node.js
```
