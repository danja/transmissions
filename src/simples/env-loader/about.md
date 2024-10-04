node src/apps-simple/env-loader/env-loader.js

from:

:envy a trm:Pipeline ;

# trm:pipe (:SC :s10 :s20 :SM) .

trm:pipe (:p10 :p20 :SC) .
:p10 a :EnvLoader .
:p20 a :WhiteboardToMessage .
