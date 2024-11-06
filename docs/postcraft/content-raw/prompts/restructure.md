# JSON Restructure Utility

## Requirements

1. The script with read JSON files in pairs from a dir `input`, apply a mapping and write the result to the dir `output`.
2. The shape of the input JSON and mapping won't be known ahead of time, the variable names and values might be anything valid in JSON.
3. In the mappings, a key will be given as "pre" which will give the path to the source data of interest. 4. In the mappings, a  path will be given, "post" that will determine the destination of the contents indicated by "pre".   
5. Any missing `pre` paths or values will be logged to console as a warning, but processing should continue.

A sample input, `input_01.json` :
```json
{
    "A": "zero",
    "B": {
        "a1": "one",
        "a2": "two",
        "a3": [
            {
                "a31": "three",
                "a32": "four"
            },
            {
                "a33": "five",
                "a34": "six"
            }
        ]
    },
    "C":{
      "c1":"seven"
        }
}
```

A sample mapping `mapping_01.json` :
```json
{
[
  {"pre":"A","post":"U"},
  {"pre":"B.a1","post":"V"},
  {"pre":"B.a3","post":"W"},
  {"pre":"C.c1", "post":"X.d"}
]
}
```

Required output `output_01.json` :
```json
{
"U":"zero",
"V": "one",
"W":  [
    {
        "a31": "three",
        "a32": "four"
    },
    {
        "a33": "five",
        "a34": "six"
    }
],
"X":{"d":"seven"}
}
```
