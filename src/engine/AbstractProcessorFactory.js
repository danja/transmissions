import logger from '../utils/Logger.js'

// Import processor groups
import SystemProcessorsFactory from '../processors/system/SystemProcessorsFactory.js'
import TestProcessorsFactory from '../processors/test/TestProcessorsFactory.js'
import FsProcessorsFactory from '../processors/fs/FsProcessorsFactory.js'
import MarkupProcessorsFactory from '../processors/markup/MarkupProcessorsFactory.js'
import UtilProcessorsFactory from '../processors/util/UtilProcessorsFactory.js'
import TextProcessorsFactory from '../processors/text/TextProcessorsFactory.js'
import ProtocolsProcessorsFactory from '../processors/protocols/ProtocolsProcessorsFactory.js'
import RDFProcessorsFactory from '../processors/rdf/RDFProcessorsFactory.js'
import PostcraftProcessorsFactory from '../processors/postcraft/PostcraftProcessorsFactory.js'
import FlowProcessorsFactory from '../processors/flow/FlowProcessorsFactory.js'
import StagingProcessorsFactory from '../processors/staging/StagingProcessorsFactory.js'
import GitHubProcessorsFactory from '../processors/github/GitHubProcessorsFactory.js'
import JSONProcessorsFactory from '../processors/json/JSONProcessorsFactory.js'
import TerrapackProcessorsFactory from '../processors/terrapack/TerrapackProcessorsFactory.js' // 2025-01-01
import LLMProcessorsFactory from '../processors/llm/LLMProcessorsFactory.js' // 2025-06-05

// added 2024-11-28
import UnsafeProcessorsFactory from '../processors/unsafe/UnsafeProcessorsFactory.js'
import HttpProcessorsFactory from '../processors/http/HttpProcessorsFactory.js'
import McpProcessorsFactory from '../processors/mcp/McpProcessorsFactory.js'

// added 2025-01-14 : Happy Birthday to me!
import ExampleProcessorsFactory from '../processors/example-group/ExampleProcessorsFactory.js'

// 2025-01-16 : finally getting around to it
import SPARQLProcessorsFactory from '../processors/sparql/SPARQLProcessorsFactory.js'

// 2025-04-21
import MediaProcessorsFactory from '../processors/media/MediaProcessorsFactory.js'
// 2025-06-04
import ReasonProcessorsFactory from '../processors/reason/ReasonProcessorsFactory.js'

class AbstractProcessorFactory {

    // looks until it finds

    static createProcessor(type, app) {

        if (!type) {
            throw new Error(`Processor type undefined (typo in 'transmission.ttl'..?)`)
        }
        logger.trace(`\nAbstractProcessorFactory.createProcessor : type.value = ${type.value}`)
        logger.trace(`AbstractProcessorFactory.createProcessor : app = ${app}`)

        var processor = ExampleProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        var processor = UnsafeProcessorsFactory.createProcessor(type, app)
        if (processor) return processor
        var processor = HttpProcessorsFactory.createProcessor(type, app)
        if (processor) return processor
        var processor = McpProcessorsFactory.createProcessor(type, app)
        if (processor) return processor
        var processor = TestProcessorsFactory.createProcessor(type, app)
        if (processor) return processor
        var processor = UtilProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        processor = FsProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        processor = MarkupProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        processor = TextProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        processor = ProtocolsProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        processor = RDFProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        processor = PostcraftProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        processor = SystemProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        processor = FlowProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        processor = GitHubProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        processor = StagingProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        processor = JSONProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        var processor = TerrapackProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        var processor = SPARQLProcessorsFactory.createProcessor(type, app)
        if (processor) return processor

        var processor = MediaProcessorsFactory.createProcessor(type, app)
        if (processor) return processor
        var processor = ReasonProcessorsFactory.createProcessor(type, app)
        if (processor) return processor
        var processor = LLMProcessorsFactory.createProcessor(type, app)
        if (processor) return processor
    }
}

export default AbstractProcessorFactory