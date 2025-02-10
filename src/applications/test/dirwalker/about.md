# DirWalker

## Runner

```sh
cd ~/hyperdata/transmissions  # my local path

./trans dirwalker
```

Defaults to `dataDir`, which defaults to `src/applications/test/dirwalker/data`

```sh
 ./trans -v dirwalker |grep message.filepath
                        message.filepath: about.md
                        message.filepath: config.ttl
                        message.filepath: data/about-data.md
                        message.filepath: data/subdir/about-subdir.md
                        message.filepath: transmissions.ttl
```

## Description

---

- Goal : a tool to recursively read local filesystem directories, checking for files with the `.md` extension to identify collections of such
- Goal : documentation of the app creation process
- Implementation : a #Transmissions application
- SoftGoal : reusability
- _non-goal_ - efficiency
