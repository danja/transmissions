## Prompts

Please write an nodejs ES6 Javascript function that will take a file path as an argument and crawl directories from that location, obtaining the path of each file it encounters and printing it to the console. It should operate asynchronously. So given an input filesystem tree like this:
.
├── 2002-December
│   ├── 000420.html
│   ├── 000421.html
├── 2002-July
   └── 000185.html

it should output:

./2002-December/000420.html
./2002-December/000421.html
./2002-July/000185.html

---

How can this function be modified to filter specific file types?

---

please modify the source to have an es6 style, using 'import' instead of 'require'

---
