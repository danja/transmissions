# config-setting-target

## Description

It has a setting in `tests/apps/config-setting-target/tt.ttl` that takes precendence over the setting in `config.ttl`.

## Runner

```sh
cd ~/hyperdata/transmissions # my local path
./trans -v config-setting-target tests/apps/config-setting-target

# ./trans config-setting --verbose --message '{"theSettingProperty": "the setting value from message" }'
```
