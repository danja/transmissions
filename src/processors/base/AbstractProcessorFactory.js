
// TODO move

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

class AbstractProcessorFactory {

    // looks until it finds
    // good enough for now 

    static createProcessor(type, config) {
        //   logger.debug("ProcessorFactory.createProcessor : " + type.value)

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

        //   throw new Error("Unknown processor type: " + type.value)
    }
}

export default AbstractProcessorFactory