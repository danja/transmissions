# GitHubList processor module for Transmissions

Your Goal is to write a processor module for Transmissions that will call GitHub to obtain a list of a user's personal repositories. First review these instructions as a whole, and then identify the subgoals. Then, taking each subgoal in turn, break it down into a concrete series of tasks. Carry out the sequence of tasks.  
You have plenty of time, so don't rush, try to be as careful in understanding and operation as possible.
Existing source code may be found in the Project Knowledge files.

Two modules are required -

1. `GitHubList` located in :
```sh
./trans-apps/applications/git-apps/processors/GitHubList.js
```
modeled on :
```sh
./transmissions/src/processors/templates/ProcessorTemplate.js
```

2. `GitHubProcessorsFactory` located in
``` sh
./trans-apps/applications/git-apps/processors/GitHubProcessorsFactory.js
```
modeled on :
```sh
/transmissions/src/processors/templates/TemplateProcessorsFactory.js
```

The input message will contain the user's name represented in this form (`danja` is an example name) :
```json
{
  "github" :
  { "name": "danja" }
}
```

The output message will append a list of the user's repositories in this form (`repo1`, `repo2` are example repository names) :
```json
{
  github :
  { "name" : "danja",
     "repositories" : ["repo1", "repo2"]
   }
}
```

The functionality of `GitHubList`  will be implemented using the `octokit` npm library, with the `dotenv` library to manage the API key. The key will either be available as an underlying OS environment variable of specified in the file
```sh
./trans-apps/applications/git-apps/.env
```

Initially, `GitHubList` will be tested and used via a runner of the same shape as :
```sh
./transmissions/src/simples/env-loader/env-loader.js
 ```

After you have finished all these, re-read the high level Goal and taking each of your derived subgoals in turn, review your code to ensure that it fulfils the requirements.

---

/home/danny/github-danny/postcraft/danny.ayers.name/content-raw/entries/2024-09-27_lively-distractions.md

https://github.com/github/rest-api-description
