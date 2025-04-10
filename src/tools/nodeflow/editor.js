// src/tools/nodeflow/editor.js
import './editor.css'
import { TransmissionEditor } from './components/index.js'

// Preload RDF dependencies for browser environment
import grapoi from 'grapoi'
import rdfExt from '../../utils/browser-rdf-ext.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import ns from '../../utils/ns.js'

// Make dependencies available globally
window.isBrowserEnvironment = true
window.transmissionsDebug = true
window.grapoi = grapoi
window.rdfExt = rdfExt
window.GrapoiHelpers = GrapoiHelpers
window.ns = ns
window.grapoiLoaded = true

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize editor
    const canvas = document.getElementById('canvas')
    if (!canvas) {
        console.error('Canvas element not found')
        return
    }

    // Create editor instance
    const editor = new TransmissionEditor(canvas)
    window.transmissionsEditor = editor

    // Set up UI elements
    const fileInput = document.getElementById('file-input')
    const loadBtn = document.getElementById('load-btn')
    const saveBtn = document.getElementById('save-btn')
    const newBtn = document.getElementById('new-btn')
    const organizeBtn = document.getElementById('organize-btn')
    const loadSampleBtn = document.getElementById('load-sample-btn')
    const status = document.getElementById('status')

    // New transmission dialog
    const newDialog = document.getElementById('new-dialog')
    const transmissionName = document.getElementById('transmission-name')
    const cancelNewBtn = document.getElementById('cancel-new')
    const createNewBtn = document.getElementById('create-new')

    // Load TTL file
    loadBtn.addEventListener('click', () => {
        fileInput.click()
    })

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                status.textContent = `Loading ${file.name}...`
                const fileURL = URL.createObjectURL(file)
                await editor.loadFromFile(fileURL)
                status.textContent = `Loaded ${file.name}`
            } catch (error) {
                status.textContent = `Error: ${error.message}`
                console.error('Load error:', error)
            }
        }
    })

    // Save TTL file
    saveBtn.addEventListener('click', async () => {
        try {
            status.textContent = 'Preparing TTL data...'
            const ttlContent = await editor.prepareTTLContent()

            // Download the content
            const blob = new Blob([ttlContent], { type: 'text/turtle' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'transmission.ttl'
            document.body.appendChild(a)
            a.click()

            // Clean up
            setTimeout(() => {
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            }, 0)

            status.textContent = 'Saved to transmission.ttl'
        } catch (error) {
            status.textContent = `Error: ${error.message}`
            console.error('Save error:', error)
        }
    })

    // Create new transmission
    newBtn.addEventListener('click', () => {
        newDialog.style.display = 'block'
    })

    cancelNewBtn.addEventListener('click', () => {
        newDialog.style.display = 'none'
    })

    createNewBtn.addEventListener('click', () => {
        const name = transmissionName.value.trim() || 'New Transmission'
        editor.createNewTransmission(name)
        newDialog.style.display = 'none'
        status.textContent = `Created new transmission: ${name}`
    })

    // Organize graph
    organizeBtn.addEventListener('click', () => {
        try {
            editor.getGraph().organize()
            status.textContent = 'Graph organized!'
        } catch (error) {
            status.textContent = `Error: ${error.message}`
            console.error('Organize error:', error)
        }
    })

    // Load sample file
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', async () => {
            try {
                status.textContent = 'Loading sample file...'
                await loadSampleFile(editor)
                status.textContent = 'Sample file loaded'
            } catch (error) {
                status.textContent = `Error loading sample: ${error.message}`
                console.error('Sample load error:', error)
            }
        })
    }

    // Try to load a sample file on startup
    try {
        status.textContent = 'Loading sample file...'
        await loadSampleFile(editor)
        status.textContent = 'Sample file loaded'
    } catch (error) {
        status.textContent = 'Ready - Click "Load TTL" to open a transmission file'
        console.warn('Could not auto-load sample:', error)
    }
})

/**
 * Load a sample transmission file
 */
async function loadSampleFile(editor) {
    const samplePath = 'samples/transmissions.ttl'
    await editor.loadFromFile(samplePath)
}