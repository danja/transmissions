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

  async execute(message) {
    try {
      // bits for templater
      message.templateFilename = message.rootDir + '/' + message.indexPage.templateFilename

      logger.debug('Template = ' + message.templateFilename)
      const rawEntryPaths = this.resolveRawEntryPaths(message)
      message.content = ''
      // TODO move this out to template and/or separate services
      //   for (var f of rawEntryPaths) {
      //   const n = rawEntryPaths.length
      const entryCount = 5
      //    for (var i = entryCount - 1; i >= 0; i--) {
      for (var i = 0; i < entryCount; i++) {
        const rawEntryPath = rawEntryPaths.pop()
        message.content += (await readFile(rawEntryPath)).toString()
      }

      // needed?
      message.contentBlocks.content = message.content
      //  "indexPage": {
      //  "filepath": "public/blog/index.html",
      message.filepath = message.rootDir + '/' + message.indexPage.filepath
      // message.rootDir + '/' + message.entryContentToPage.targetDir + '/' + message.slug + '.html'

      // /home/danny/HKMS/postcraft/danny.ayers.name/layouts/mediocre
      this.emit('message', message)
    } catch (err) {
      logger.error('Error in FrontPagePrep')
      logger.error(err)
    }
  }

  resolveRawEntryPaths(message) { // TODO tidy up
    var paths = []
    //   const entryCount = 5

    const slugs = message.slugs
    const entryCount = slugs.length
    var path
    for (let i = 0; i < entryCount; i++) {
      var path = slugs[i]
      //   logger.log('slug = ' + path)
      if (!path) break

      path = message.rootDir + '/' + message.entryContentMeta.targetDir + '/' + path + '.html'
      paths.push(path)
      //logger.log('PATH = ' + path)
    }
    return paths
  }

}

export default FrontPagePrep