```prompt
There was talk of adding support for one transmission loading another like a subroutine to help things be more modular, encapsulated. These would be declared in a `transmissions.tll` for example as :

```turtle
@prefix : <http://purl.org/stuff/transmissions/> .

:parent a :Transmission ;
    :pipe (:p10 :p20 :p30) .

:p10  a :NOP .
:p20  a :child .
:p30  a :ShowMessage .

:child a :Transmission ;
  :pipe (:c10 :c20) .

:c10 a :NOP .
:c20 a :NOP .
```

With this, the system would use `src/engine/ApplicationManager.js` to create an `src/model/Application.js` containing two instances of `src/model/Transmission.js` with `src/engine/TransmissionBuilder.js`, these would be connected together by instances of `src/model/Connector.js`. When run the message flow would be equivalent to :

```turtle
:combined a :Transmission ;
    :pipe (:p10 :c10 :c20 :p30) .
```

There may be some kind of support for this already in place, otherwise how would you suggest implementing this feature?
```
