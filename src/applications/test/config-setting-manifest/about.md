# config-setting-manifest

## Description

It has a setting in `tests/applications/config-setting-manifest/manifest.ttl` that takes precendence over the setting in `config.ttl`.

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans -v config-setting-manifest tests/applications/config-setting-manifest

# ./trans config-setting --verbose --message '{"theSettingProperty": "the setting value from message" }'
```
