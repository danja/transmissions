// src/processors/github/GitHubList_no-pag.js

import { Octokit } from '@octokit/rest'
import dotenv from 'dotenv'
import Processor from '../../model/Processor.js'
import logger from '../../utils/Logger.js'

// Load environment variables from the specified path
dotenv.config({ path: './trans-apps/applications/git-apps/.env' })

/**
 * @class GitHubList
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Fetches a list of GitHub repositories for a specified user using the GitHub API.
 * This implementation does not include pagination, so it will only return the first page of results.
 *
 * ### Processor Signature
 *
 * #### __*Environment Variables*__
 * * **`GITHUB_TOKEN`** - Required GitHub personal access token with appropriate scopes
 *
 * #### __*Input*__
 * * **`message.github.name`** - (string, required) GitHub username to fetch repositories for
 *
 * #### __*Output*__
 * * **`message.github.repositories`** - (string[]) Array of repository names
 * * **`message`** - The original message with the repositories array added
 *
 * #### __*Behavior*__
 * * Authenticates with GitHub using the provided token
 * * Fetches the first page of repositories for the specified user
 * * Extracts and returns repository names
 * * Handles common error cases including rate limiting
 *
 * #### __*Side Effects*__
 * * Makes external API calls to GitHub
 * * Modifies the input message by adding the repositories array
 *
 * #### __*Limitations*__
 * * Does not support pagination (limited to first 30 repositories)
 * * Requires a valid GitHub token with appropriate permissions
 *
 * @example
 * // Basic usage
 * const processor = new GitHubList({});
 * await processor.process({
 *   github: {
 *     name: 'octocat'  // GitHub username
 *   }
 * });
 * // Result: { github: { name: 'octocat', repositories: ['repo1', 'repo2', ...] } }
 *
 * @example
 * // With error handling
 * try {
 *   await processor.process({ github: { name: 'nonexistent-user' } });
 * } catch (error) {
 *   console.error('Failed to fetch repositories:', error.message);
 * }
 */
class GitHubList extends Processor {
    /**
     * Creates a new GitHubList processor instance.
     * Initializes the GitHub API client with the token from environment variables.
     * @param {Object} config - Processor configuration
     * @throws {Error} If GITHUB_TOKEN is not set in environment variables
     */
    constructor(config) {
        super(config)
        logger.debug('GitHubList constructor called')
        
        if (!process.env.GITHUB_TOKEN) {
            throw new Error('GITHUB_TOKEN environment variable is not set')
        }
        
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
        logger.debug('Octokit instance created')
    }

    /**
     * Fetches repositories for the specified GitHub user.
     * @param {Object} message - The message object containing the GitHub username
     * @param {Object} message.github - GitHub related data
     * @param {string} message.github.name - GitHub username to fetch repositories for
     * @returns {Promise<void>} Resolves when the operation is complete
     * @throws {Error} If the GitHub username is not provided or API request fails
     */
    /**
     * @typedef {Object} GitHubMessage
     * @property {Object} github
     * @property {string} github.name - GitHub username
     * @property {string[]} [github.repositories] - Will be populated with repository names
     */
    
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
     * Fetches repositories for the specified GitHub user.
     * @param {GitHubMessage} message - The message object containing the GitHub username
     * @returns {Promise<void>} Resolves when the operation is complete
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
        logger.debug(`Fetching repositories for username: ${username}`)

        try {
            logger.debug('Calling GitHub API to list repositories for user')
            const { data } = await this.octokit.repos.listForUser({ 
                username,
                // Note: Pagination is not implemented in this version
                // Consider adding pagination parameters (page, per_page) for complete results
            })
            logger.debug(`Fetched ${data.length} repositories`)

            // Extract just the repository names from the response
            const repositories = data.map(repo => repo.name)
            logger.debug(`Extracted ${repositories.length} repository names`)

            // Add repositories to the message with proper type assertion
            const githubMessage = /** @type {GitHubMessage} */ (message)
            githubMessage.github.repositories = repositories
            logger.debug('Updated message with repositories')

            // Emit the updated message
            this.emit('message', message)
            logger.debug('Emitted updated message')
        } catch (error) {
            let githubError;
            const errorMsg = `Failed to fetch repositories for ${username}: ${error.message}`
            logger.error(errorMsg)
            logger.debug('Error details:', JSON.stringify(error, null, 2))
            
            if (error.status === 403) {
                const rateLimitMsg = 'GitHub API rate limit exceeded. Please check your token limits.'
                logger.warn(rateLimitMsg)
                githubError = new GitHubError(
                    `${error.message}. ${rateLimitMsg}`, 
                    {
                        status: error.status,
                        headers: error.headers,
                        request: error.request,
                        code: 'RATE_LIMIT_EXCEEDED',
                        details: {
                            documentation_url: 'https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting'
                        }
                    }
                )
            } else if (error.status === 404) {
                githubError = new GitHubError(
                    `GitHub user '${username}' not found`,
                    {
                        status: error.status,
                        code: 'USER_NOT_FOUND',
                        details: { username }
                    }
                )
            } else {
                githubError = new GitHubError(
                    error.message,
                    {
                        status: error.status,
                        headers: error.headers,
                        request: error.request,
                        code: 'API_ERROR',
                        details: { username }
                    }
                )
            }
            
            throw githubError
        }
    }
}

export default GitHubList