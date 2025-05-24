(This is partially implemented but not properly wired together or tested).

The server components start a long-running http process. When called with a HTTP POST the payload will be processed by the app. 

For example using the app defined in `src/applications/test/echo`, the command 
```sh
./trans -w -p 5000 echo
```
Should start a server on `http://localhost:5000/echo`. The HTTP API version of `echo` should wait for HTTP POST calls, in which there should be a `message` parameter. An instance of the `echo` app will be give this as message. After the processors in the app have been run through, the HTTP server should return the resulting `message` object as payload. 

If the calling message contains the single value `{ "system":"stop"}` the HTTP server should shut down gracefully.

There is also a simple command-line test client as well as unit and integration tests using Vitest (ES modules).

### Notes
Other options include :
```sh
cd ~/hyperdata/transmissions/
./trans --verbose --web --port 4200 echo

./trans -v -w -p 4200 echo

./trans -v -w -t -p 4200 echo
```

compare with :

```sh
./trans  -v echo
```




