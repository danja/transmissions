# Creating a new Service

1. Preparation
2. Specification : StringFilter Signature
3. Implementation
4. Unit Tests
5. Integrate
6. Integration Test(s)
7. Documentation

## Preparation

_Lean towards YAGNI, at least on the first pass, but reusability is a #SoftGoal, so if a little generalization/extra utility is trivial to put, why not._

What the **globbo** application needs this service to do is filter out strings that don't match `*.md`, but this can be generalised at low cost. A common pattern (for patterns) is having an **include** and **exclude** list.

Find something similar :

```
src/services/text/StringReplace.js
```

Its **Signature** (see JSDocs) declares that it has `message.content` as an input and output.That's reusable here.

## StringFilter Signature

**_Input_**

- **`message.content`** - the string to be tested
- **`message.include`** - (optional) whitelist, a string or list of strings
- **`message.exclude`** - (optional) blacklist, a string or list of strings

**_Output_**

- **`message.content`**

**_Behavior_**

- first the value of `message.content` is tested against `message.exclude`, if a match **isn't** found, `message.content` is passed through to the output
- next the value of `message.content` is tested against `message.include`, if a match **is** found, `message.content` is passed through to the output

The rules need to be defined. Seems easiest to follow those used by systems like `package.json`. Noted in `/home/danny/github-danny/transmissions/docs/postcraft-site/articles/service_string-filter.md`

## Implementation

The skeleton in : `src/services/ServiceExample.js` is copied to the appropriate subdir of `src/services/` (here `text`) and renamed. The `import` paths will need adjusting.

Then the `execute(message)` needs to be written to provide the required functionality.

**Here is where AI can really help.**

In this instance I've expanded the skeleton code a little, which I will pass to an assistant along with a description of the required behaviour (in `service_string-filter.md`).

> At this point in time the #Transmissions repo is such that, after running `repopack` (see `runners.md`) the result fits in 78% of the space available to a Claude Project, giving it a good context for understanding what is required.

```javascript
import logger from "../../utils/Logger.js";
import ProcessService from "../base/Service.js";

class StringFilter extends ProcessService {
  constructor(config) {
    super(config);
  }

  accepted(message) {
    var accepted = true;
    logger.debug("testing patterns");
    return accepted;
  }
  async execute(message) {
    logger.debug(
      "\nStringFilter Input : \nmessage.content = " + message.content
    );
    logger.debug("message.exclude = ");
    logger.reveal(message.exclude);
    logger.debug("message.include = ");
    logger.reveal(message.include);
    logger.debug("\nOutput : \nmessage.content = " + message.content);
    if (accepted) {
      this.emit("message", message);
    }
  }
}

export default StringFilter;
```

Claude gave me something that on visual inspection, seemed very close to what I asked for. It got the order of include/exclude back-to-front and made the code a little bit more verbose than it needed to be, but those issues are easily fixed manually.

## Unit Tests

Choose an existing test to serve as a model. `tests/unit/NOP.spec.js` is minimal but contains the essentials.

**AI time again.**

## Integrate

Services are created using the Factory pattern. An entry should be added to `TextServicesFactory` (simply copy, paste & tweak an existing entry).

## Integration Test(s)

Create a minimal `transmission.ttl` that uses the new service.

NEED A VALUE-TESTER SERVICE THAT LOADS A JSON AND/OR RDF FILE AND COMPARES VALUES WITH MESSAGE

NEED A SINGLETON CAPTUREALL SERVICE TO COLLECT CONTENT

7. Documentation
