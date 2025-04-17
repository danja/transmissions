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

#:todo move echo and all the test\_ to applications/system

I want to be able to run :
./trans --editor
or
./trans -e

and have the system use `src/api/common/CommandUtils.js` to launch a web server via `src/api/http/server/WebRunner.js` and then open a browser to the editor as launched when using npm run dev
