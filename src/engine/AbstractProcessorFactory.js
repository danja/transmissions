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

// added 2024-11-28
import UnsafeProcessorsFactory from '../processors/unsafe/UnsafeProcessorsFactory.js'
import HttpProcessorsFactory from '../processors/http/HttpProcessorsFactory.js'
import McpProcessorsFactory from '../processors/mcp/McpProcessorsFactory.js'
import XmppProcessorsFactory from '../processors/xmpp/XmppProcessorsFactory.js'

// added 2025-01-14 : Happy Birthday to me!
import ExampleProcessorsFactory from '../processors/example-group/ExampleProcessorsFactory.js'

// 2025-01-16 : finally getting around to it
import SPARQLProcessorsFactory from '../processors/sparql/SPARQLProcessorsFactory.js'

class AbstractProcessorFactory {

    // looks until it finds

    static createProcessor(type, config, transmissionConfig) {

        if (!type) {
            throw new Error(`Processor type undefined (typo in 'transmission.ttl'..?)`)
        }
        logger.trace(`\nAbstractProcessorFactory.createProcessor : type.value = ${type.value}`)
        logger.trace(`AbstractProcessorFactory.createProcessor : config = ${config}`)

        var processor = ExampleProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        var processor = UnsafeProcessorsFactory.createProcessor(type, config)
        if (processor) return processor
        var processor = HttpProcessorsFactory.createProcessor(type, config)
        if (processor) return processor
        var processor = McpProcessorsFactory.createProcessor(type, config)
        if (processor) return processor
        var processor = XmppProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        var processor = TestProcessorsFactory.createProcessor(type, config)
        if (processor) return processor
        var processor = UtilProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        processor = FsProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        processor = MarkupProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        processor = TextProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        processor = ProtocolsProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        processor = RDFProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        processor = PostcraftProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        processor = SystemProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        processor = FlowProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        processor = GitHubProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        processor = StagingProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        processor = JSONProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        var processor = TerrapackProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

        var processor = SPARQLProcessorsFactory.createProcessor(type, config)
        if (processor) return processor

    }
}

export default AbstractProcessorFactory