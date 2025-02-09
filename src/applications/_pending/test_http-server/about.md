# App Template

## Runner

```sh
cd ~/github-danny/transmissions # my local path
./trans test_http-server

---
runs at :

http://localhost:4000/transmissions/test/

```

curl -X POST http://localhost:4000/shutdown

node src/applications/test_http-server/test-shutdown.js

npm test -- tests/unit/http-server_ShutdownService.spec.js

```

## Description

Test application for HttpServer processor that:

- Serves static files from data/input directory
- Listens on port 4000
- Shuts down on POST to /shutdown endpoint
- Base path: /transmissions/test/
```
