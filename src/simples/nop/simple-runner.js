// simple-runner.js
import NOP from '../../processors/flow/NOP.js'
import Fork from '../../processors/flow/Fork.js'

/*
async function runProcessor(processor, message) {
    const outputs = await processor.process(message)
    return outputs
}
*/

async function main() {
    const config = {}
    const nop = new NOP(config)
    const fork = new Fork(config)

    var message = { 'value': '42' }

    // Run NOP
    // message = await nop.execut(message)
    var outputs = await nop.process(message)
    console.log('NOP outputs:', outputs)

    // Run Fork
    message.nForks = 3
    outputs = await fork.process(message)
    console.log('Fork outputs:', outputs)
}

main().catch(console.error)