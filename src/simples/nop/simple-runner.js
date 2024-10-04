// simple-runner.js
import NOP from '../../processors/util/NOP.js'
import Fork from '../../processors/util/Fork.js'

/*
async function runProcessor(processor, message) {
    const outputs = await processor.execute(message)
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
    var outputs = await nop.execute(message)
    console.log('NOP outputs:', outputs)

    // Run Fork
    message.nForks = 3
    outputs = await fork.execute(message)
    console.log('Fork outputs:', outputs)
}

main().catch(console.error)