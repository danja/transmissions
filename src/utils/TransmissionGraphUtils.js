import logger from '../utils/Logger.js'
import ns from '../utils/ns.js'

export function getPipeNodes(transmissionDataset, transmissionID) {
    const transPoi = grapoi({ dataset: transmissionDataset, term: transmissionID })
    return transPoi.out(ns.trn.pipe).terms
}

export async function connectNodes(transmission, pipenodes) {
    for (let i = 0; i < pipenodes.length - 1; i++) {
        let leftNode = pipenodes[i]
        let leftProcessorName = leftNode.value
        let rightNode = pipenodes[i + 1]
        let rightProcessorName = rightNode.value
        logger.log(`  > Connect #${i} [${ns.getShortname(leftProcessorName)}] => [${ns.getShortname(rightProcessorName)}]`)
        transmission.connect(leftProcessorName, rightProcessorName)
    }
}
