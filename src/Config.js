// src/Config.js
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') })

class Config {
  constructor() {
    this.services = null
    this.loadServices()
  }

  /**
   * Load services configuration from config/services.json
   */
  loadServices() {
    const configPath = path.join(__dirname, '..', 'config', 'services.json')

    try {
      if (fs.existsSync(configPath)) {
        const data = fs.readFileSync(configPath, 'utf8')
        this.services = JSON.parse(data)
      } else {
        console.warn(`Config file not found: ${configPath}`)
        this.services = {}
      }
    } catch (error) {
      console.error(`Error loading services config: ${error.message}`)
      this.services = {}
    }
  }

  /**
   * Get environment (development, production, test)
   * @returns {string}
   */
  getEnvironment() {
    return process.env.NODE_ENV || 'development'
  }

  /**
   * Get service configuration by name
   * Environment variables override config file values
   *
   * @param {string} serviceName - Name of the service (e.g., 'fuseki')
   * @returns {object|null} Service configuration object
   */
  getService(serviceName) {
    if (!this.services || !this.services[serviceName]) {
      return null
    }

    const service = { ...this.services[serviceName] }
    const env = this.getEnvironment()

    // Get environment-specific config if available
    if (service.environments && service.environments[env]) {
      Object.assign(service, service.environments[env])
    }

    // Override with environment variables if present
    // Format: SERVICENAME_KEY (e.g., FUSEKI_USERNAME, FUSEKI_PASSWORD)
    const prefix = serviceName.toUpperCase() + '_'

    Object.keys(process.env).forEach(key => {
      if (key.startsWith(prefix)) {
        const configKey = key.substring(prefix.length).toLowerCase()
        service[configKey] = process.env[key]
      }
    })

    return service
  }

  /**
   * Get SPARQL endpoint configuration
   *
   * @param {string} datasetName - Dataset name (e.g., 'newsmonitor', 'semem')
   * @returns {object} Endpoint configuration with query and update URLs
   */
  getSparqlEndpoint(datasetName) {
    const fuseki = this.getService('fuseki')

    if (!fuseki) {
      throw new Error('Fuseki service not configured')
    }

    const baseUrl = fuseki.baseurl || fuseki.baseUrl || 'http://localhost:3030'
    const username = fuseki.username
    const password = fuseki.password

    return {
      queryEndpoint: `${baseUrl}/${datasetName}/query`,
      updateEndpoint: `${baseUrl}/${datasetName}/update`,
      dataEndpoint: `${baseUrl}/${datasetName}/data`,
      username,
      password,
      baseUrl,
      dataset: datasetName
    }
  }

  /**
   * Get environment variable value
   *
   * @param {string} key - Environment variable name
   * @param {*} defaultValue - Default value if not found
   * @returns {*}
   */
  getEnv(key, defaultValue = null) {
    return process.env[key] || defaultValue
  }
}

// Export singleton instance
export default new Config()
