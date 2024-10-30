I like the modeling, but the syntax is verbose. Is there a way of specifying a logical mapping, using either OWL2 or N3 reasoning, so when given the input :

```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix trm: <http://purl.org/stuff/transmission/> .
@prefix : <http://hyperdata.it/transmissions/> .

:stringpipe a trm:Pipeline ;
    trm:pipe (:s1 :s2 :s3) .

:s1 a :StringSource .
:s2 a :AppendProcess .
:s3 a :StringSink .
```

this will lead to the output :

```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix ppl: <http://purl.org/stuff/pipeline/> .
@prefix : <http://example.org/pipeline#> .

:myPipeline a ppl:Pipeline ;
    ppl:firstStage :stage1 .

:stage1 a ppl:Stage ;
    ppl:processor :StringSource ;
    ppl:next :stage2 .

:stage2 a ppl:Stage ;
    ppl:processor :AppendProcess ;
    ppl:next :stage3 .

:stage3 a ppl:Stage ;
    ppl:processor :StringSink .
```


    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix trm: <http://purl.org/stuff/transmission/> .
    @prefix : <http://hyperdata.it/transmissions/> .

    :github_list_pipeline a trm:Pipeline ;
        trm:pipe (:p10 :p20 :p30 :p40) .

    :p10 a :GitHubList .
    :p20 a :JSONWalker .
    :p30 a :HttpGet .
    :p40 a :FileWriter .
