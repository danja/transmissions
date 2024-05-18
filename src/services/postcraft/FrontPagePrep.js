import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'
import { readFile } from 'node:fs/promises'

class FrontPagePrep extends ProcessService {

  constructor(config) {
    super(config)
  }

  async execute(data, context) {
    try {
      // bits for templater
      context.templateFilename = context.rootDir + '/' + context.indexPage.templateFilename

      logger.log('TERMPLATE = ' + context.templateFilename)
      const rawEntryPaths = this.resolveRawEntryPaths(context)
      context.content = ''
      // TODO move this out to template and/or separate services
      //   for (var f of rawEntryPaths) {
      //   const n = rawEntryPaths.length
      const entryCount = 5
      //    for (var i = entryCount - 1; i >= 0; i--) {
      for (var i = 0; i < entryCount; i++) {
        const rawEntryPath = rawEntryPaths.pop()
        context.content += (await readFile(rawEntryPath)).toString()
      }

      // needed?
      context.contentBlocks.content = context.content
      //  "indexPage": {
      //  "filepath": "public/blog/index.html",
      context.filepath = context.rootDir + '/' + context.indexPage.filepath
      // context.rootDir + '/' + context.entryContentToPage.targetDir + '/' + context.slug + '.html'

      // /home/danny/HKMS/postcraft/danny.ayers.name/layouts/mediocre
      this.emit('message', false, context)
    } catch (err) {
      logger.error('Error in FrontPagePrep')
      logger.error(err)
    }
  }

  resolveRawEntryPaths(context) { // TODO tidy up
    var paths = []
    //   const entryCount = 5

    const slugs = context.slugs
    const entryCount = slugs.length
    var path
    for (let i = 0; i < entryCount; i++) {
      var path = slugs[i]
      //   logger.log('slug = ' + path)
      if (!path) break

      path = context.rootDir + '/' + context.entryContentMeta.targetDir + '/' + path + '.html'
      paths.push(path)
      //logger.log('PATH = ' + path)
    }
    return paths
  }

}

export default FrontPagePrep