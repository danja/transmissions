# StringFilter Service

Implemented in `src/services/text/StringFilter.js`

`message.content` contains the string to be tested. The patterns to be tested against are provided in `message.exclude` (blacklist) and `message.include` (whitelist) as a string or list of strings. If the string under test is accepted, it is passed through to the output in `message.content`.

If either pattern is undefined, is an empty list or empty string, it is ignored.

## Matching Rules

A simplified version of rules as found in places like `package.json` is used. For now, there is no order of precedence of patterns in a given list, so there is potential for ambiguity.

- first the value of `message.content` is tested against `message.exclude`, if a match **isn't** found, `message.content` is accepted
- next the value of `message.content` is tested against `message.include`, if a match **is** found, `message.content` is accepted

1. Pattern matching:

   - Asterisk (`*`) matches any number of characters except slashes.
   - Double asterisk (`**`) matches any number of characters including slashes.
   - Question mark (`?`) matches a single character except a slash.
   - Square brackets (`[abc]`) match any one character inside the brackets.

2. Directory indicators:

   - A slash (/) at the end of a pattern indicates a directory.
   - A slash at the beginning of a pattern indicates the root of the project.

3. Empty patterns are ignored.

4. Patterns are case-sensitive
