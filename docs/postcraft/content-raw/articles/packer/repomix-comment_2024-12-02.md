I've been using s/repopack/repomix extensively with Claude Projects. I've found it incredibly useful, many thanks @yamadashy, excellent work! (if you would like praise expressed more formally/for promotional materials, let me know).

The main project 'Transmissions' I'm working on at the moment has LOC & repomix stats as below. I'm predominantly using node, occasional bits of browser stuff (also a toy language 'sheltopusik' I have in-progress, the less said about that the better - hence the instantly forgettable name).
Transmissions is still lacking key features and is neither nor stable nor documented enough for anyone else to have a use for it. But there is some intersection with repomix, in that I'm trying to find a sweetspot for working with LLMs. It's a pipeliney thing with major decoupling, the intention being that any part that needs work on can be comfortably understood in the current size of context windows. This also means I've got a ton of other related projects, each with their own repo, varying sizes.

The repomix config for transmissions isn't far off defaults regarding code, except I do have several additions to the ignore section - like a docs dir that currently includes masses of irrelevant (and redundant) styling stuff. But the (hopefully) useful stuff takes up 55% of the Claude Project knowledge (funny, it was 63% but just now I noticed there was another irrelevant dir - the Top 5 is a great feature!). In addition to this I have a smaller associated repo that notches it up to 73%. This, with a fairly verbose system prompt, seems to push the limits of utility. So trying to connect another project, which may also produce a sizable repomix, with Transmissions was a problem.

My dev workflow for a New Feature (more or less) is figuring out a prompt describing my requirements for it, repomixing (good verb) and replacing the project's current knowledge, starting a new chat session in the project. This I follow for maybe a dozen interactions, 6 or so artifacts, then halt, however prematurely, and ask for a handover document (I have a bunch of commands in the system prompt, ho gives me a summary as an artifact, including metadata in RDF/Turtle). Even being careful, with the Big Knowledge, I often hit the token limit. Claudio gets another walk.
Something I've found useful when working with the other project as the main context, but still wishing Claude to have knowledge of Transmissions for integration purposes, is to have this in my package.json :

{
...
  "scripts": {
    "rp": "repomix -c repomix.config-small.json . && repomix -c repomix.config-large.json . ",
   ...
   }
}
repomix.config-small.json has a lot more in the ignore section, stripping things back to a bare minimum, used in auxiliary projects. repomix.config-large.json has everything relevant, used in 'transmissions' itself.

(I'm leaving it as legacy rp, I'm all-Linux here rm is rarely wise :)

fyi @yamadashy, I plan to use chunks of repomix, pulled apart into small pieces, in my Transmissions pipeliney thing. I've not actually looked yet how things are exposed, but ideally I'd like to use it as a lib, so one node on my processing pipeline loads the config, another build the path filters, aother does the treewalking etc etc.

Whatever, thanks again, keep up the good work!
  Pack Summary:
────────────────
  Total Files: 264
  Total Chars: 314527
 Total Tokens: 73062
       Output: ./repopack-transmissions-large.txt
     Security: ✔ No suspicious files detected

transmissions$ cloc src
     231 text files.
     166 unique files.                                          
      65 files ignored.

github.com/AlDanial/cloc v 1.98  T=3.00 s (55.4 files/s, 2928.8 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
JavaScript                     115           1035           1082           3971
Markdown                        28            461              5           1113
HTML                             2             17              0            763
JSON                            14              0              0            292
Bourne Shell                     1              8              9              9
Text                             6              0              0              7
-------------------------------------------------------------------------------
SUM:                           166           1521           1096           6155
-------------------------------------------------------------------------------
