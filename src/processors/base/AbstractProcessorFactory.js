import logger from '../../utils/Logger.js'

// Import processor groups
import SystemProcessorsFactory from '../system/SystemProcessorsFactory.js'
import TestProcessorsFactory from '../test/TestProcessorsFactory.js'
import FsProcessorsFactory from '../fs/FsProcessorsFactory.js'
import MarkupProcessorsFactory from '../markup/MarkupProcessorsFactory.js'
import UtilProcessorsFactory from '../util/UtilProcessorsFactory.js'
import TextProcessorsFactory from '../text/TextProcessorsFactory.js'
import ProtocolsProcessorsFactory from '../protocols/ProtocolsProcessorsFactory.js'
import RDFProcessorsFactory from '../rdf/RDFProcessorsFactory.js'
import PostcraftProcessorsFactory from '../postcraft/PostcraftProcessorsFactory.js'
import FlowProcessorsFactory from '../flow/FlowProcessorsFactory.js'
import StagingProcessorsFactory from '../staging/StagingProcessorsFactory.js'
import GitHubProcessorsFactory from '../github/GitHubProcessorsFactory.js'
import JSONProcessorsFactory from '../json/JSONProcessorsFactory.js'
import TerrapackProcessorsFactory from '../terrapack/TerrapackProcessorsFactory.js' // 2025-01-01

// added 2024-11-28
import UnsafeProcessorsFactory from '../unsafe/UnsafeProcessorsFactory.js'
import HttpProcessorsFactory from '../http/HttpProcessorsFactory.js'
import McpProcessorsFactory from '../mcp/McpProcessorsFactory.js'
import XmppProcessorsFactory from '../xmpp/XmppProcessorsFactory.js'

// added 2025-01-14 : Happy Birthday to me!
import ExampleProcessorsFactory from '../example-group/ExampleProcessorsFactory.js'

// 2025-01-16 : finally getting around to it
import SPARQLProcessorsFactory from '../sparql/SPARQLProcessorsFactory.js'

class AbstractProcessorFactory {

    // looks until it finds
    // good enough for now

    static createProcessor(type, config) {
        logger.trace(`\nAbstractProcessorFactory.createProcessor : type.value = ${type.value}`)
        //  logger.debug(`AbstractProcessorFactory.createProcessor : config = ${config}`)

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