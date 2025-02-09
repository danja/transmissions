# Selfie

Focus on test status first

every application should have :

- end-to-end
- simples
- confirmed processors
- docs

confirmed processors should have :

- unit
- integration
- application
- docs

Scan `transmissions`, generate self-descriptions - per-dir about.md, about.ttl

## Runner

```sh
cd ~/github-danny/transmissions # my local path
./trans app-template
```

## Description

---

- Goal : a tool to recursively read local filesystem directories, checking for files with the `.md` extension to identify collections of such
- Goal : documentation of the app creation process
- Implementation : a #Transmissions application
- SoftGoal : reusability
- _non-goal_ - efficiency
