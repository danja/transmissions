import TestSetting from '../../../processors/test/TestSetting.js'
import logger from '../../../utils/Logger.js'
import ns from '../../../utils/ns.js'
import rdf from 'rdf-ext'

logger.setLogLevel('debug')
// Create test dataset with configuration
const dataset = rdf.dataset()
const settingsNode = rdf.namedNode('http://purl.org/stuff/transmissions/theSettingsNode')
const config = { dataset }

/*
:ts10 a :TestSetting ;
     :settings :theSettingsNode .

     :theSettingsNode a :ConfigSet ;
    :theSettingProperty "the setting value from config" .

     */

// Add test settings to dataset
dataset.add(rdf.quad(
    settingsNode,
    ns.rdf.type,
    ns.trn.ConfigSet
))

dataset.add(rdf.quad(
    settingsNode,
    ns.trn.theSettingProperty,
    rdf.literal('the setting value from config')
))

logger.log(dataset)

// Create instance with config
const testSetting = new TestSetting(config)
testSetting.settingsNode = settingsNode

// Test message for processing
const message = { value: '42' }

async function runTest() {
    // Process message through TestSettings
    const result = await testSetting.process(message)
    logger.log('Name from config:', testSetting.getProperty(ns.trn.theSettingProperty))
    logger.reveal(result)
}

runTest().catch(console.error)