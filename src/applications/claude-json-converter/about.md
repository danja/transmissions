```sh
cd ~/github-danny/transmissions/

./trans -v claude-json-converter -m '{"sourceFile":"/home/danny/github-danny/hyperdata/docs/chat-archives/data-2025-01-26-21-27-52/conversations.json"}'

./trans claude-json-converter
```

---

```turtle
####  testing only
:nop a trn:Transmission ;
    rdfs:label "nop" ;
    rdfs:comment "NOP for testing" ;
trn:pipe (:n10) .

:n10 a :NOP .

# testing only - FileWriter will save message
:cb a trn:Transmission ;
     rdfs:label "cb" ;
     rdfs:comment "Claude blanker" ;
     trn:pipe (:ccc10   :cb10 :cb20 :cb30) .

:cb10 a :SetMessage ;
     trn:settings :setDump .

:cb20 a :FileWriter .

:cb30 a :Blanker ; # clear values
     trn:settings :blankContent .

##################
##################### only for testing
:bContent a :ConfigSet ;
    rdfs:label "Root node in JSON object for blanker" ;
    :settings :blankContent  ;
    :pointer "content"  ;
    :preserve "content.payload.test.third" .

:setDump a :ConfigSet ;
    :setValue (:sv0)  . # consider using blank nodes
    :sv0   :key    "dump" ;
            :value  "true"  .
#########################################################################
```

#####################################

After `FileReader` (and `Blanker`):

```
{
    // system message bits,

    "content": [
        {
            "uuid": "",
            "name": "",
            "created_at": "",
            "updated_at": "",
            "account": {
                "uuid": ""
            },
            "chat_messages": [
                {
                    "uuid": "",
                    "text": "",
                    "content": [
                        {
                            "type": "",
                            "text": ""
                        }
                    ],
                    "sender": "",
                    "created_at": "",
                    "updated_at": "",
                    "attachments": [],
                    "files": [
                        {
                            "file_name": ""
                        }
                    ]
                },
                {
                    ...
                }
            ]
        }
}
```

`JSONWalker` fires off a message per-conversation.

These need `Restructure` to split off the common metadata as `message.content`, and move `chat_messages` to `message.content`, ready for -

`JSONWalker` fires off a message per-conversation.
