import path from 'path'
import { expect } from 'chai'
import rdf from 'rdf-ext'
import { Parser } from '@rdfjs/parser-n3'
import ConfigMap from '../../src/processors/rdf/ConfigMap.js'
import stringToStream from 'string-to-stream'

describe('ConfigMap Integration Tests', () => {
  let configMap
  let message
  const testBasePath = '/test/base'

  beforeEach(() => {
    configMap = new ConfigMap({})
    message = {
      rootDir: testBasePath,
      dataset: rdf.dataset()
    }
  })

  async function loadTestData(turtle) {
    const parser = new Parser()
    const stream = stringToStream(turtle)
    message.dataset = await rdf.dataset().import(parser.import(stream))
  }

  it('should resolve paths from ContentGroup', async () => {
    await loadTestData(`
      @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
      @prefix pc: <http://purl.org/stuff/postcraft/> .
      @prefix fs: <http://purl.org/stuff/filesystem/> .
      @prefix t: <http://hyperdata.it/transmissions/> .

      t:Content a pc:ContentGroup ;
        fs:sourceDirectory "content/src" ;
        fs:targetDirectory "content/out" ;
        pc:template "templates/main.njk" .
    `)

    await configMap.process(message)

    expect(message.sourceDir).to.equal('/test/base/content/src')
    expect(message.targetDir).to.equal('/test/base/content/out')
    expect(message.filepath).to.equal('/test/base/templates/main.njk')
  })

  it('should preserve absolute paths', async () => {
    await loadTestData(`
      @prefix pc: <http://purl.org/stuff/postcraft/> .
      @prefix fs: <http://purl.org/stuff/filesystem/> .
      @prefix t: <http://hyperdata.it/transmissions/> .

      t:Content a pc:ContentGroup ;
        fs:sourceDirectory "/abs/path/src" ;
        fs:targetDirectory "/abs/path/out" .
    `)

    await configMap.process(message)

    expect(message.sourceDir).to.equal('/abs/path/src')
    expect(message.targetDir).to.equal('/abs/path/out')
  })

  it('should handle missing paths', async () => {
    await loadTestData(`
      @prefix pc: <http://purl.org/stuff/postcraft/> .
      @prefix t: <http://hyperdata.it/transmissions/> .

      t:Content a pc:ContentGroup .
    `)

    await configMap.process(message)

    expect(message.sourceDir).to.be.undefined
    expect(message.targetDir).to.be.undefined
    expect(message.filepath).to.be.undefined
  })

  it('should normalize paths', async () => {
    await loadTestData(`
      @prefix pc: <http://purl.org/stuff/postcraft/> .
      @prefix fs: <http://purl.org/stuff/filesystem/> .
      @prefix t: <http://hyperdata.it/transmissions/> .

      t:Content a pc:ContentGroup ;
        fs:sourceDirectory "content/../src" .
    `)

    await configMap.process(message)
    expect(message.sourceDir).to.equal('/test/base/src')
  })

  it('should throw on invalid paths', async () => {
    await loadTestData(`
      @prefix pc: <http://purl.org/stuff/postcraft/> .
      @prefix fs: <http://purl.org/stuff/filesystem/> .
      @prefix t: <http://hyperdata.it/transmissions/> .

      t:Content a pc:ContentGroup ;
        fs:sourceDirectory null .
    `)

    await expect(configMap.process(message)).to.be.rejected
  })
})