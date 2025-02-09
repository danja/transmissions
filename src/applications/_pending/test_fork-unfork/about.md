# Test Fork/Unfork

## ./trans test_fork-unfork

```
./run test_fork | grep 's2 a NOP'
```

should show the number of forks + 1 (for `message.done`)

```
./run test_fork | grep s1.s2.s10.s11.s12.s13
```

should show just one
