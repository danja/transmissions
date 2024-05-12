# Test Fork/Unfork

```
./run test_fork | grep 's2 a NOP'
```

should show the number of forks + 1 (for `context.done`)

```
./run test_fork | grep s1.s2.s10.s11.s12.s13
```

should show just one
