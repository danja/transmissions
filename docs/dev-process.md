# Transmissions Dev Process

see also Postcraft Flow : 2024-04-27

For a transmission called `example`

0. create a working directory `transmissions/src/applications/example` (henceforth, `example`)
1. sketch out process steps in `example/about.md`
2. check against existing services
3. create any new services that are needed
4. create `example/transmission.ttl`
5. create `example/services.ttl`

6. if a manifest is appropriate, create `project-dir/manifest.ttl`

Running without manifest :

```
transmissions$ ./run example
```

With manifest :

```
./run example project-dir
```

---

./run postcraft /home/danny/HKMS/postcraft/danny.ayers.name

---

DOcument them!!!

For example-task

create any additional services, eg. SomeService.js

add to ServiceFactory

create example-task_transmission.ttl
create example-task_services.ttl

create a runner, example-task.js
