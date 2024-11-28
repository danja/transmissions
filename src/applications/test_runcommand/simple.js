import RunCommand from '../../processors/unsafe/RunCommand.js'
import FileWriter from '../../processors/fs/FileWriter.js'
import FileReader from '../../processors/fs/FileReader.js'
import CaptureAll from '../../processors/util/CaptureAll.js'
import WhiteboardToMessage from '../../processors/util/WhiteboardToMessage.js'

const config = {
    "simples": "true",
    "allowedCommands": ["ls", "echo", "pwd"],
    "blockedPatterns": ["rm", ">", "|", ";"],
    "sourceFile": "input/input-01.txt",
    "destinationFile": "output/output-01.txt",
    "whiteboard": []
}

async function runPipeline() {
    console.log('Starting pipeline test with whiteboard...')
    var message = { "dataDir": "src/applications/test_runcommand/data" }

    // Initialize shared processors
    const capture = new CaptureAll(config)
    const whiteboardToMessage = new WhiteboardToMessage(config)

    // Stage 1: Get current directory
    const pwdCommand = new RunCommand({ ...config, command: "pwd" })
    message = await pwdCommand.process(message)
    message = await capture.process(message)

    // Stage 2: List directory contents
    const lsCommand = new RunCommand({ ...config, command: "ls -l" })
    message = await lsCommand.process(message)
    message = await capture.process(message)

    // Stage 3: Echo combined output
    message = await whiteboardToMessage.process(message)
    const combinedOutput = message.whiteboard.commandResult
        .map(result => result.stdout)
        .join('\n')

    const echoCommand = new RunCommand({
        ...config,
        command: `echo 'Command Outputs:\n${combinedOutput}'`
    })
    message = await echoCommand.process(message)

    // Stage 4: Write final output
    const write = new FileWriter(config)
    message = await write.process(message)

    // Stage 5: Read back and verify
    const read = new FileReader(config)
    message = await read.process(message)
    console.log('Final output:', message.content)

    // Show whiteboard contents
    console.log('\nWhiteboard contents:')
    console.log(JSON.stringify(config.whiteboard, null, 2))
}

runPipeline().catch(console.error)