// src/processors/postcraft/FrontPagePrep.js

import path from 'path'
import { readFile } from 'node:fs/promises'

import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'


class FrontPagePrep extends ProcessProcessor {
  constructor(config) {
    super(config)
  }


  async execute(message) {
    //  logger.setLogLevel('debug')
    try {
      message.templateFilename = message.rootDir + '/' + message.indexPage.templateFilename
      logger.debug('Template = ' + message.templateFilename)

      const rawEntryPaths = this.resolveRawEntryPaths(message)
      message.content = ''

      // TODO tidy up
      const entryCount = Math.min(5, rawEntryPaths.length) // Limit to 5 entries or less
      logger.debug('FrontPagePrep, entryCount = ' + entryCount)

      const rangeStart = rawEntryPaths.length - entryCount
      const rangeEnd = rawEntryPaths.length - 1
      //     for (let i = 0; i < entryCount; i++) {
      for (let i = rangeEnd; i >= rangeStart; i--) {
        logger.debug('FrontPagePrep, i = ' + entryCount)
        const rawEntryPath = rawEntryPaths[i]
        if (rawEntryPath) {
          message.content += await readFile(rawEntryPath, 'utf8')
        } else {
          logger.warn(`Skipping undefined entry path at index ${i}`)
        }
      }

      message.contentBlocks.content = message.content
      // TODO join
      message.filepath = message.rootDir + '/' + message.indexPage.filepath

      this.emit('message', message)
    } catch (err) {
      logger.error('Error in FrontPagePrep')
      logger.error(err)
    }
  }

  resolveRawEntryPaths(message) {
    const paths = []
    const slugs = message.slugs || []
    const entryCount = slugs.length

    for (let i = 0; i < entryCount; i++) {
      const slug = slugs[i]
      if (slug) {
        //   const path = message.rootDir + '/' + message.entryContentMeta.targetDir + '/' + slug + '.html'
        const filePath = path.join(message.rootDir, message.entryContentMeta.targetDir, slug + '.html')
        paths.push(filePath)
      }
    }

    return paths
  }
}

export default FrontPagePrep