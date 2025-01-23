import TestSettings from '../../processors/test/TestSettings.js'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'

// Create test dataset with configuration
const dataset = rdf.dataset()
const settingsNode = rdf.namedNode('http://example.org/settings')
const config = { dataset }

// Add test settings to dataset
dataset.add(rdf.quad(
    settingsNode,
    ns.rdf.type,
    ns.trn.ConfigSet
))

dataset.add(rdf.quad(
    settingsNode,
    ns.trn.name,
    rdf.literal('Test Name')
))

dataset.add(rdf.quad(
    settingsNode,
    ns.trn.path,
    rdf.namedNode('http://example.org/test/path')
))

// Create instance with config
const testSettings = new TestSettings(config)
testSettings.settingsNode = settingsNode

// Test message for processing
const message = { value: '42' }

async function runTest() {
    // Process message through TestSettings
    const result = await testSettings.process(message)
    logger.log('Name from config:', testSettings.getProperty(ns.trn.name))
    logger.log('Path from config:', testSettings.getProperty(ns.trn.path))
    logger.reveal(result)
}

runTest().catch(console.error)