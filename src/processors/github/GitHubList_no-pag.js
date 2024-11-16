import { Octokit } from '@octokit/rest'
import dotenv from 'dotenv'
import Processor from '../base/Processor.js'
import logger from '../../utils/Logger.js'

dotenv.config({ path: './trans-apps/applications/git-apps/.env' })

class GitHubList extends Processor {
    constructor(config) {
        super(config)
        logger.debug('GitHubList constructor called')
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
        logger.debug('Octokit instance created')
    }

    async process(message) {
        logger.debug('GitHubList execute method called')
        logger.debug('Input message:', JSON.stringify(message, null, 2))

        if (!message.github || !message.github.name) {
            logger.error('GitHub username not provided in the message')
            throw new Error('GitHub username not provided in the message')
        }

        const username = message.github.name
        logger.debug(`Fetching repositories for username: ${username}`)

        try {
            logger.debug('Calling GitHub API')
            const { data } = await this.octokit.repos.listForUser({ username })
            logger.debug(`Fetched ${data.length} repositories`)

            const repositories = data.map(repo => repo.name)
            logger.debug('Extracted repository names:' + repositories)

            message.github.repositories = repositories
            logger.debug('Updated message:', JSON.stringify(message, null, 2))

            this.emit('message', message)
            logger.debug('Emitted updated message')
        } catch (error) {
            logger.error(`Error fetching repositories for ${username}:`, error)
            logger.debug('Error details:', JSON.stringify(error, null, 2))
            if (error.status === 403) {
                logger.warn('Possible rate limit exceeded. Check GitHub API rate limits.')
            }
            throw error
        }
    }
}

export default GitHubList