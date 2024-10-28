// GitHubProcessorsFactory.js
import logger from '../../../../transmissions/src/utils/Logger.js';
import ns from '../../../../transmissions/src/utils/ns.js';
import GitHubList from './GitHubList.js';

class GitHubProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.t.GitHubList)) {
            return new GitHubList(config);
        }
        return false;
    }
}

export default GitHubProcessorsFactory;