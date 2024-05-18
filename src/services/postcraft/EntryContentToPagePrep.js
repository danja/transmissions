import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class EntryContentToPagePrep extends ProcessService {

  constructor(config) {
    super(config)
  }

  async execute(data, context) {
    if (context.done) {
      this.emit('message', false, context)
      return
    }

    /*
      "entryContentToPage": {
    "sourceDir": "public/post-content-cache",
    "targetDir": "public/blog",
    "templateFilename": "layouts/mediocre/post-page_template.njk"
  },
  */
    context.templateFilename = context.rootDir + '/' + context.entryContentToPage.templateFilename

    context.template = false

    context.contentBlocks.content = context.content

    context.filepath = context.rootDir + '/' + context.entryContentToPage.targetDir + '/' + context.slug + '.html'

    //   logger.log('\ncontext.filepath  = ' + context.filepath)
    // /home/danny/HKMS/postcraft/danny.ayers.name/layouts/mediocre
    this.emit('message', false, context)
  }

}

export default EntryContentToPagePrep