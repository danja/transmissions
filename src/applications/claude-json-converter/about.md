```sh
cd ~/github-danny/transmissions/
./trans claude-json-converter

# -P src/applications/claude-json-converter/data/input/conversations.json
```

After `FileReader` :

```
{
    // system message bits

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
