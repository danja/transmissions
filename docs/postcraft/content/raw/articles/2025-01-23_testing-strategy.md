# Testing Strategy

```turtle
:packer a trn:Transmission ;
    rdfs:label "Repository Packer" ;
    trn:pipe (:p10 :p20 :p30 :p40 :p50 :p60 :p70 :p80) .

:p10 a :DirWalker ;
    trn:settings :dirWalker .

:p20 a :StringFilter ;
    trn:settings :filterConfig .

:p30 a :FileReader ;
    trn:settings :readConfig .

:p40 a :FileContainer ;
    trn:settings :containerConfig .

:p50 a :CaptureAll .

:p60 a :WhiteboardToMessage .

:p70 a :Unfork .

:p80 a :FileWriter ;
    trn:settings :writeConfig .
```
