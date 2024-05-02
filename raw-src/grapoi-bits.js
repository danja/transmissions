const poi = this.getMyPoi()
logger.log('POIPOI')
for (const quad of poi.out().quads()) {
    logger.log(`\t${quad.predicate.value}: ${quad.object.value}`)
}

