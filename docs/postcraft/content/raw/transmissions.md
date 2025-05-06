## Transmissions - for my sanity, to go in docs

Silly. The other day I moved some tests out of the way temporarily, forgot to put them back. Also got seriously mixed up with my naming of things.

Good prompt for a refactor.

interesting :

LOG_LEVEL=debug TRACE=1 ./trans config-setting-target tests/applications/config-setting-target

**HERE**
The app has :

app.configDataset
app.transDataset
app.targetDataset

only **app** is passed around

## Terminology


### Message

### Processor

### Transmission

`transmissions.ttl`

### Settings


derived from

Order of precedence,  :

1. *message*
2. `tt.ttl` - target definition
3. `transmissions.ttl` - transmissions definition
4. `config.ttl` - default configuration



### App

* a runnable set of transmissions

### Target

* the datasource on which the application should be run


---
