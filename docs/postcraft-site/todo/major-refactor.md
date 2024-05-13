# A Big Refactor

MAKE TESTS FIRST

- (data, context) -> (stuff)
- data -> stuff.default

rename /mill to /engine

##### :Stash . :UnFork Unsafe LATERS

in Service.js, async executeQueue() {

      context = structuredClone(context) // TODO make optional

it's also in DirWalker?

rename Fork/Unfork - multicast?

rename Service.getTags()

context.contentBlocks -> context.contentMeta?
