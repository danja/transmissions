// src/processors/github/GitHubList.js

import { Octokit } from '@octokit/rest'
import dotenv from 'dotenv'
import Processor from '../../model/Processor.js'
import logger from '../../../../transmissions/src/utils/Logger.js'

dotenv.config({ path: './trans-apps/apps/git-apps/.env' })

/**
 * @class GitHubList
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Fetches a list of GitHub repositories for a specified user using the GitHub API.
 * This implementation includes pagination to fetch all available repositories.
 *
 * ### Processor Signature
 *
 * #### __*Environment Variables*__
 * - **`GITHUB_TOKEN`** - Required GitHub Personal Access Token with `public_repo` scope
 *
 * #### __*Input*__
 * - **`message`** - The message object
 * - **`message.payload.github.username`** - GitHub username to fetch repositories for (required)
 *
 * #### __*Output*__
 * - **`message.payload.github.repositories`** - Array of repository names for the specified user
 *
 * #### __*Behavior*__
 * - Fetches all public repositories for the specified GitHub user using pagination
 * - Handles GitHub API rate limiting and authentication
 * - Returns repository names in the format: `owner/repo`
 * - Automatically handles pagination to fetch all available repositories
 *
 * #### __*Side Effects*__
 * - Makes HTTP requests to the GitHub API
 * - Requires a valid GitHub token with appropriate permissions
 *
 * @example
 * // Basic usage
 * const processor = new GitHubList()
 * await processor.process({
 *   payload: {
 *     github: {
 *       username: 'octocat'  // GitHub username
 *     }
 *   }
 * })
 * // Result: { payload: { github: { username: 'octocat', repositories: ['octocat/Hello-World', ...] } } }
 *
 * @example
 * // With error handling
 * try {
 *   await processor.process({ payload: { github: { username: 'nonexistent-user' } } });
 * } catch (error) {
 *   console.error(error.message)
 *   console.error(error.details) // Additional error details
 * }
 */

class GitHubList extends Processor {
    constructor(config) {
        super(config)
        logger.debug('GitHubList constructor called')
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
        logger.debug('Octokit instance created')
    }

    async process(message) {
        //    logger.setLogLevel('debug')
        logger.debug('GitHubList process method called')

        try {
            // Initialize payload.github if missing
            if (!message.payload) {
                message.payload = {}
            }
            if (!message.payload.github) {
                message.payload.github = {}
            }

            //     const username = message.payload.github.name
            const username = message.github.name
            logger.debug(`Processing for username: ${username}`)

            logger.debug('Calling GitHub API with pagination')
            logger.info(`Starting repository fetch for ${username}`)

            const repositories = await this.fetchAllRepositories(username)
            logger.debug(`Setting ${repositories.length} repositories in payload`)

            // Set in payload, not message.github
            message.payload.github.repositories = repositories
            message.payload.github.totalRepos = repositories.length

            return this.emit('message', message)
        } catch (error) {
            this.handleError(error, username)
        }
    }

    async fetchAllRepositories(username) {
        const repositories = []
        let page = 1
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

        /*
        while (true) {
            try {
                const response = await this.octokit.repos.listForUser({
                    username,
                    per_page: 100,
                    page: page
                })

                repositories.push(...response.data.map(repo => repo.name))
                logger.debug(`Fetched page ${page} with ${response.data.length} repositories`)

                this.checkRateLimit(response.headers)

                if (response.data.length < 100) break
                page++

                await delay(1000) // 1 second delay between API calls
            } catch (error) {
                throw this.createDetailedError(error, 'Error fetching repositories page')
            }
        }
            */

        while (true) {
            const response = await this.octokit.repos.listForUser({
                username,
                per_page: 100,
                page
            })

            let data = response.data
            //  data = data.slice(0, 3) // Limit to first 3 repos

            logger.debug(`Page ${page}: Got ${data.length} repos`)

            repositories.push(...data.map(repo => repo.name))

            if (data.length < 100) break
            page++

            // Add delay between requests
            await new Promise(r => setTimeout(r, 5000))
        }

        logger.debug(`Total repositories found: ${repositories.length}`)

        return repositories
    }

    checkRateLimit(headers) {
        const remaining = headers['x-ratelimit-remaining']
        const resetTime = new Date(headers['x-ratelimit-reset'] * 1000)
        logger.info(`Rate limit remaining: ${remaining}, Reset time: ${resetTime}`)

        if (remaining < 10) {
            logger.warn(`Rate limit is low. Only ${remaining} requests left. Reset at ${resetTime}`)
        }
    }

    createDetailedError(error, message) {
        const detailedError = new Error(`${message}: ${error.message}`)
        detailedError.status = error.status
        detailedError.response = error.response
        return detailedError
    }

    handleError(error, username) {
        logger.error(`Error fetching repositories for ${username}:`, error.message)
        logger.debug('Error details:', JSON.stringify(error, null, 2))

        if (error.status === 403) {
            logger.warn('Rate limit exceeded. Check GitHub API rate limits.')
            throw new Error('GitHub API rate limit exceeded')
        } else if (error.status === 404) {
            logger.warn(`User ${username} not found on GitHub`)
            throw new Error(`GitHub user ${username} not found`)
        } else {
            throw new Error(`Failed to fetch GitHub repositories: ${error.message}`)
        }
    }
}

export default GitHubList