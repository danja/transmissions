# Libraries Used

## Core

## For Services

### Protocol-related

- [Axios](https://axios-http.com/docs/intro)

### Document manipulation

- [cheerio](https://cheerio.js.org/) - parsing and manipulating HTML (and XML)
- [Turndown](https://github.com/mixmark-io/turndown) - Convert HTML into Markdown

### Alternatives

Choices above made on a couple of criteria :

- must be well-known & well-maintained
- rather than any all-in-one dedicated lib, more fine-grained preferred for reusability

For Web crawling, node's own `fetch()` was the simplest option, but [Axios](https://axios-http.com/docs/intro) has a bunch of convenience wrappers - data is passed around as JSON objects.
https://apidog.com/blog/axios-vs-fetch/#:~:text=Axios%20provides%20the%20data%20in,response%20has%20an%20error%20status.

For HTML page parsing options start with various SAX-like streaming alternatives, then move into more DOM-oriented systems, and beyond into to tools that can run headless browsers and work with anything rendered dynamically in a page. The stand-out choices seemed to be [cheerio](https://cheerio.js.org/)

### Maybe later

https://github.com/jessetane/queue/tree/master
