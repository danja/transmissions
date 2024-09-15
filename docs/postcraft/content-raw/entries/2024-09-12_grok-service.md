I just Messaged Mari :

> Hah, major distraction from what I was going to do. For help I was going to ask Claude, the AI tool I'm currently paying for. But it was out of service. Tried another, Groq - is pretty good free. Noticed a service they offer for using their AI from code. Appears to be free right now. So This hour I will spend adding it to my code...

Ok, [Groq Playground](https://console.groq.com/playground) lets you run sample API calls. Has a button 'View Code'. Tried it, code is below.

Good-oh, they have an SDK to do some of the drudge work, that simplifies things for now.
No mention of the API key in the code example, but in docs nearby they say :

> Configure your API key as an environment variable.
> Presumably the SDK picks that up.

(There is a nodejs lib I've used somewhere for using a _hidden_ `.env` file for such stuff, may be worth considering later)

I guess I'll put this in `~/.bashrc` :

```bash
export GROQ_API_KEY=<your-api-key-here>
```

Hah! It's already there. My bloody memory, eh.

Hmm, I could really do with -

~~TODO~~ lift initial #Transmissions message from file

Hang on, I might already be able to do this with `FileReader`, I wonder...

Signature includes :

**_Input_**

- **message.filepath**
  **_Output_**
- **message.content**

Mostly. It reads a file and dumps the content into the message. Won't know what it is though. Need a flag to say it'll be JSON (or whatever). That should go in `services-config.ttl`. Errm, HTTP media type? Claude says `application/json` or `application/json; charset=utf-8`. I believe node defaults to `utf-8`, so I'll ignore that bit.

Should be an easy enough tweak. I'll need to set up a test application for Grok API calls anyway, so I might as well do that now.

TODO link this in with new service walkthrough docs

TODO create a skeleton application template

Within #transmissions there's an app I was working on recently, hadn't got very far, `src/applications/globbo`. I'll copy that over to the other repo so :

```bash
danny@danny-desktop:~/github-danny/trans-apps$ tree applications/test-grok-api/
...
applications/test-grok-api/
├── about.md
├── services-config.ttl
└── transmissions.ttl
...
```

TODO figure out/remember & doc what WhiteboardToMessage does

Ok, starter `transmissions.ttl`, I just want it to show the message before & after a `FileReader` :

```turtle
...
:test_grok_api a trm:Pipeline ;
    trm:pipe (:SM1 :s10 :SM2) .

:s10 a FileReader .
```

`SM1`, `SM2` will create instances of the `ShowMessage` service, dump the message to console, I've got them in the top of the Turtle file for easy reuse.

`./trans -h` tells me (on this fs layout) I need to run :

```bash
./trans test-grok-api -d  ../trans-apps/applications
```

Ok, pretty good, it gives me:

```bash
...
+ ***** Execute Transmission :  <http://hyperdata.it/transmissions/test_grok_api>
| Running : http://hyperdata.it/transmissions/SM1 a ShowMessage
***************************
***  Message
Instance of Object with properties -
{
  "dataDir": "../trans-apps/applications/test-grok-api/data",
  "rootDir": "[no key]",
  "tags": "SM1"
}
***************************
| Running :  (SM1) s10 a FileReader
TypeError: this.getMyConfig is not a function
```

TODO The error is likely due to non-existent expected field(s) in the message.

I don't think I'll need `rootDir` any time soon, but `dataDir` is nice to have. I'll stick the messages for Grok in there:

`/home/danny/github-danny/trans-apps/applications/test-grok-api/data/grok-messages_01.json`

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are dull-witted armchair philosopher with a bad temper and obsession with Victorian ladies' undergarments. You respond to questions with terse, bad-tempered statements which have little relevance to the topic at hand."
    },
    {
      "role": "user",
      "content": "Based on current scientific understanding of particle physics, what is matter?"
    }
  ],
  "model": "llama3-8b-8192",
  "temperature": 1,
  "max_tokens": 1024,
  "top_p": 1,
  "stream": true,
  "stop": null
}
```

I need to point `FileReader` at this. Any recent (likely to work) examples of its use in `transmissions/applications`?
`postcraft/transmissions.ttl` has a couple, but they don't appear to pull a filename. `link-lister/transmissions.ttl` has:

```turtle
:s1 a :FileReader ;
    trm:configKey :sourceFile .
```

which is just what's needed, but that's an old thing, I might have broken. Check its `services-config.ttl` :

```turtle
t:llSourceMap a trm:DataMap ;
    trm:key t:sourceFile ;
    trm:value "starter-links.md" .
```

Hmm. Put this in `services-config.ttl` :

```turtle
t:test a trm:MessageFile ;
    trm:key t:messageFile ;
    trm:value "grok-messages_01.json" .
```

and tweak `transmissions.ttl` :

See what goes in the message...nothing.

Aah...more recently touched services have eg. :

```
this.getPropertyFromMyConfig(ns.trm.source)
```

Jeez. I had to look through lots before getting that bit near.

TODO tidy up namespaces

And `FileReader` uses `rootDir`...scrollback...

Ok, in the message `dataDir` has the necessary. It would be legit for `FileReader` to use that if `rootDir` is undefined

TODO refactor so the value is copied across around `run.js`

Workaround for now, put the check in `FileReader`

Now to interpret by media type, for now just JSON.

Ok, so all the above took a long time, but now I have a message containing :

```json
  "fromfile": {
    "messages": [
      {
        "role": "system",
```

I'd better stop at 21:50.

Command line :

```bash
./trans test-grok-api -d  ../trans-apps/applications
```

In `transmission.ttl` :

```turtle
:s10 a :FileReader ;
    trm:configKey :filename .
```

In `services-config.ttl` :

```turtle
t:test a trm:ServiceConfig ;
    trm:key t:filename ;
    trm:mediaType "application/json" ;
    trm:messageFile "grok-messages_01.json" .
```

Next session on this -

Not immediately necessary, but passing the value `message.fromfile` looks a bit ugly, doesn't suggest reuse for the Grok API call service (or similars). A `RemapContext` seems appropriate simply to flip it to `message.messages`.

TODO rename `RemapContext` to `RemapMessage`

Then pretty much copy & paste the guts below to make a `GrokChatCompletion` service.

TODO ~~read up on~~ ask Claude about loading JS/ES modules dynamically, so `GrokChatCompletion.js` can live under `trans-apps`, to not pile up the dependencies on core Transmissions.

Asked - in https://claude.ai/chat/ababe767-af96-4e10-830b-ab4f3ad096fd

The responses appear more useful after I suggested using Java's command-line -classpath approach as an analogy. And a bit more interesting when I was wondering about edge-case-ish scenarios when you might have conflicting versions available. Stuff about JS interpreter caching I'd not come across, need to be a bit more awake to take in.

22:26, enough.

```javascript
const Groq = require("groq-sdk");

const groq = new Groq();
async function main() {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "you are a nodejs developer. Keep responses very short and to the point",
      },
      {
        role: "user",
        content:
          "I would like to involve a bunch of documents I have locally in a RAG kind of setup calling on Grok to give the effect of the modelhaving been trained on custom data. Would it be beneficial to create a vector representation, tokenise or anything like that? \n",
      },
    ],
    model: "llama3-8b-8192",
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null,
  });

  for await (const chunk of chatCompletion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

main();
```
