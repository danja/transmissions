// src/processors/github/GitHubList_no-pag.js

import { Octokit } from '@octokit/rest'
import dotenv from 'dotenv'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

// Load environment variables
dotenv.config({ path: './trans-apps/applications/git-apps/.env' })

if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable is required')
}

// Initialize Octokit with authentication
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

/**
 * Custom error class for GitHub API errors
 * @extends Error
 */
class GitHubError extends Error {
    /**
     * @param {string} message - Error message
     * @param {Object} [options] - Additional error options
     * @param {number} [options.status] - HTTP status code
     * @param {Object} [options.headers] - Response headers
     * @param {Object} [options.request] - Request details
     * @param {string} [options.code] - Error code
     * @param {Object} [options.details] - Additional error details
     */
    constructor(message, { status, headers, request, code, details } = {}) {
        super(message);
        this.name = 'GitHubError';
        this.status = status;
        this.headers = headers;
        this.request = request;
        this.code = code;
        this.details = details;
    }
}

/**
 * @typedef {Object} GitHubMessage
 * @property {Object} github
 * @property {string} github.name - GitHub username
 * @property {string[]} [github.repositories] - Will be populated with repository names
 */

/**
 * @class GitHubList
 * @extends Processor
 * @classdesc
 * A Transmissions processor that lists GitHub repositories for a given user.
 * This implementation does not include pagination, so it will only return the first page of results.
 *
 * ### Processor Signature
 *
 * #### __*Environment Variables*__
 * - **`GITHUB_TOKEN`** - Required GitHub Personal Access Token with `public_repo` scope
 *
 * #### __*Input*__
 * - **`message`** - The message object
 * - **`message.github.name`** - GitHub username to fetch repositories for (required)
 *
 * #### __*Output*__
 * - **`message.github.repositories`** - Array of repository names for the specified user
 *
 * #### __*Behavior*__
 * - Fetches public repositories for the specified GitHub user
 * - Handles GitHub API rate limiting and authentication
 * - Returns repository names in the format: `owner/repo`
 *
 * #### __*Side Effects*__
 * - Makes HTTP requests to the GitHub API
 * - Requires a valid GitHub token with appropriate permissions
 *
 * @example
 * // Basic usage
 * const processor = new GitHubList()
 * await processor.process({
 *   github: {
 *     name: 'octocat'  // GitHub username
 *   }
 * })
 * // Result: { github: { name: 'octocat', repositories: ['octocat/Hello-World', ...] } }
 *
 * @example
 * // With error handling
 * try {
 *   await processor.process({ github: { name: 'nonexistent-user' } });
 * } catch (error) {
 *   console.error(error.message)
 *   console.error(error.details) // Additional error details
 * }
 */
class GitHubList extends Processor {
    /**
     * Fetches repositories for the specified GitHub user.
     * @param {GitHubMessage} message - The message object containing the GitHub username
     * @returns {Promise<boolean>} Resolves to true when the operation is complete
     * @throws {GitHubError} If the GitHub username is not provided or API request fails
     */
    async process(message) {
        logger.debug('GitHubList process method called')
        logger.debug('Input message:', JSON.stringify(message, null, 2))

        if (!message?.github?.name) {
            const errorMsg = 'GitHub username not provided in the message. Expected message.github.name'
            logger.error(errorMsg)
            throw new GitHubError(errorMsg, { 
                code: 'MISSING_USERNAME',
                details: { field: 'message.github.name' }
            })
        }

        const username = message.github.name
        logger.debug(`Fetching repositories for user: ${username}`)

        try {
            // Fetch repositories for the user
            const { data } = await octokit.repos.listForUser({
                username,
                type: 'owner',
                sort: 'updated',
                per_page: 100
            })

            // Extract repository names
            const repositories = data.map(repo => repo.full_name)
            logger.debug(`Found ${repositories.length} repositories for user ${username}`)

            // Add repositories to the message
            message.github.repositories = repositories
            logger.debug('Updated message with repositories')

            // Emit the updated message
            this.emit('message', message)
            logger.debug('Emitted updated message')
            return true
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            const errorStatus = typeof error === 'object' && error !== null ? (error as any).status : undefined
            
            let githubError;
            const errorMsg = `Failed to fetch repositories for ${username}: ${errorMessage}`
            logger.error(errorMsg)
            
            if (errorStatus === 403) {
                const rateLimitMsg = 'GitHub API rate limit exceeded. Please check your token limits.'
                logger.warn(rateLimitMsg)
                githubError = new GitHubError(
                    `${errorMessage}. ${rateLimitMsg}`, 
                    {
                        status: errorStatus,
                        code: 'RATE_LIMIT_EXCEEDED',
                        details: {
                            documentation_url: 'https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting'
                        }
                    }
                )
            } else if (errorStatus === 404) {
                githubError = new GitHubError(
                    `GitHub user '${username}' not found`,
                    {
                        status: errorStatus,
                        code: 'USER_NOT_FOUND',
                        details: { username }
                    }
                )
            } else {
                githubError = new GitHubError(
                    errorMessage,
                    {
                        status: errorStatus,
                        code: 'API_ERROR',
                        details: { 
                            username,
                            message: errorMessage
                        }
                    }
                )
            }
            
            throw githubError
        }
    }
}

export default GitHubList
