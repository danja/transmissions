# goto-message Test App

Tests GOTO processor with target specified via command-line message.

The GOTO processor reads the target transmission ID from the message's gotoTarget property passed via command line.

Expected usage: `./trans goto-message -m '{"gotoTarget": "target-transmission"}'`

Expected output: "TEST_PASSED"