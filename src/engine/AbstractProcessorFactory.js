
// TODO move

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

        throw new Error("Unknown processor type: " + type.value)
    }
}

export default AbstractProcessorFactory