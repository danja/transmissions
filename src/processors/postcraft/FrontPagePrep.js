// src/processors/postcraft/FrontPagePrep.js

import path from 'path'
import { readFile } from 'node:fs/promises'

import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'


class FrontPagePrep extends Processor {
  constructor(config) {
    super(config)
  }


  async process(message) {
    logger.setLogLevel('debug')
    //logger.reveal(message)
    if (message.targetPath) {
      message.templateFilename = path.join(message.targetPath, message.indexPage.templateFilename)
    } else {
      message.templateFilename = path.join(message.rootDir, message.indexPage.templateFilename)
    }

    logger.debug('FrontPagePrep, Template = ' + message.templateFilename)
    // process.exit()

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

    if (message.targetPath) {
      message.filepath = path.join(message.targetPath, message.indexPage.filepath)
    } else {
      message.filepath = path.join(message.rootDir, message.indexPage.filepath)
    }
    return this.emit('message', message)

  }

  resolveRawEntryPaths(message) {
    const paths = []
    const slugs = message.slugs || []
    const entryCount = slugs.length

    for (let i = 0; i < entryCount; i++) {
      const slug = slugs[i]
      if (slug) {
        //   const path = message.rootDir + '/' + message.entryContentMeta.targetDir + '/' + slug + '.html'
        let filePath
        if (message.targetPath) {
          filePath = path.join(message.targetPath, message.entryContentMeta.targetDir, slug + '.html')
        } else {
          filePath = path.join(message.rootDir, message.entryContentMeta.targetDir, slug + '.html')
        }
        paths.push(filePath)
      }
    }

    return paths
  }
}

export default FrontPagePrep