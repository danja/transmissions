// GitHubProcessorsFactory.js
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import GitHubList from './GitHubList.js'

class GitHubProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.GitHubList)) {
            return new GitHubList(config);
        }
        return false;
    }
}

export default GitHubProcessorsFactory;