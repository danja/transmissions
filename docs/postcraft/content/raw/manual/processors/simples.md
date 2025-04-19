# Simples

#:todo currently broken

Simples are hardcoded pipelines that may be useful during Processor development and testing as well as a route to creating dedicated applications reusing Processor code. Their complexity depends largely on the number of message fields and settings values with which they need to interact. They are probably not worth attempting if the message flow is other than a simple serial pipeline.

If only one Processor is involved, locate accordingly, eg.

Processor :
```sh
src/processors/text/Escaper.js
```

Simples :
```
src/simples/text/escaper.js
```
