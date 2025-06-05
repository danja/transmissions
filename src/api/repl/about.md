# REPL for Transmissions

The REPL (Read-Eval-Print Loop) in this project provides an interactive command-line interface for working with Transmissions apps.

## Features
- **Interactive Input:** Type messages or commands and see immediate responses from the selected app.
- **App Context:** The REPL operates in the context of a specific app, which can be changed at runtime using the `/app <appName>` command.
- **Slash Commands:** Commands starting with `/` (e.g., `/quit`, `/help`, `/app`) are handled by the `Commands.js` module, allowing for extensible control and utility features.
- **Graceful Exit:** Use `/quit` or `/q` to exit the REPL cleanly.
- **Verbosity Control:** Use `/more` and `/less` to adjust the verbosity of logging output.
- **Argument Handling:** Any arguments after a slash command are passed as an array to the command handler.

## Usage
- Start the REPL via the CLI with the `--repl` or `-r` option.
- Type a message to send it to the current app.
- Use `/help` to see available commands.

## Extending
To add new commands, edit `src/api/repl/Commands.js` and add a new static async method to the `Commands` class.

---
This REPL is designed for flexibility and developer productivity when working with Transmissions apps.
