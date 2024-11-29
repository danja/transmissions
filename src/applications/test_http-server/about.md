# App Template

## Runner

```sh
cd ~/github-danny/transmissions # my local path
./trans test_http-server

---

curl -X POST http://localhost:4000/shutdown
or
/src/applications/test_http-server$ node test-shutdown.js
```

## Description

Test application for HttpServer processor that:

- Serves static files from data/input directory
- Listens on port 4000
- Shuts down on POST to /shutdown endpoint
- Base path: /transmissions/test/
