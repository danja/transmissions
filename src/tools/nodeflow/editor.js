import './editor.css'
import { TransmissionEditor } from './components/index.js'

// Import utilities
import grapoi from 'grapoi'
import rdfExt from '../../utils/browser-rdf-ext.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import ns from '../../utils/ns.js'

// Make utilities available globally for debugging
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

    // Get UI elements
    const fileInput = document.getElementById('file-input')
    const loadBtn = document.getElementById('load-btn')
    const saveBtn = document.getElementById('save-btn')
    const newBtn = document.getElementById('new-btn')
    const organizeBtn = document.getElementById('organize-btn')
    const loadSampleBtn = document.getElementById('load-sample-btn')
    const status = document.getElementById('status')
    const loadingEl = document.getElementById('loading')
    const loadingMessage = document.getElementById('loading-message')

    // Dialog elements
    const newDialog = document.getElementById('new-dialog')
    const transmissionName = document.getElementById('transmission-name')
    const cancelNewBtn = document.getElementById('cancel-new')
    const createNewBtn = document.getElementById('create-new')

    // Instructions elements
    const instructions = document.getElementById('instructions')
    const closeInstructionsBtn = document.getElementById('close-instructions')

    // Show instructions if it's the first visit
    if (!localStorage.getItem('transmissionsEditorInstructionsShown')) {
        instructions.classList.add('show')
        localStorage.setItem('transmissionsEditorInstructionsShown', 'true')
    }

    // Close instructions button
    if (closeInstructionsBtn) {
        closeInstructionsBtn.addEventListener('click', () => {
            instructions.classList.remove('show')
        })
    }

    // Add load file button event
    loadBtn.addEventListener('click', () => {
        fileInput.click()
    })

    // Helper function to show loading state
    function showLoading(message) {
        loadingMessage.textContent = message
        loadingEl.classList.add('show')
    }

    // Helper function to hide loading state
    function hideLoading() {
        loadingEl.classList.remove('show')
    }

    // Handle file selection
    fileInput.addEventListener('change', async (e) => {
        console.log(`File input change event triggered`, e)
        const file = e.target.files[0]
        if (file) {
            try {
                status.textContent = `Loading ${file.name}...`
                showLoading(`Loading ${file.name}...`)
                console.log(`Loading file: ${file.name}`)

                // Create a FileReader to read the file content
                const reader = new FileReader()

                reader.onload = async (event) => {
                    try {
                        console.log(`File content loaded, creating blob URL`)
                        // Create a temporary URL containing the TTL content
                        const turtleContent = event.target.result
                        const blob = new Blob([turtleContent], { type: 'text/turtle' })
                        const fileURL = URL.createObjectURL(blob)

                        // Load the file into the editor
                        console.log(`Loading from blob URL: ${fileURL}`)
                        await editor.loadFromFile(fileURL)
                        status.textContent = `Loaded ${file.name}`
                        hideLoading()

                        // Clean up the temporary URL
                        URL.revokeObjectURL(fileURL)
                    } catch (error) {
                        hideLoading()
                        status.textContent = `Error parsing file: ${error.message}`
                        console.error('Load error:', error)
                    }
                }

                reader.onerror = () => {
                    hideLoading()
                    status.textContent = `Error reading file`
                    console.error('FileReader error')
                }

                // Read the file as text
                reader.readAsText(file)
            } catch (error) {
                hideLoading()
                status.textContent = `Error: ${error.message}`
                console.error('Load error:', error)
            }
        }

        // Clear the file input so the same file can be loaded again
        fileInput.value = ''
    })

    // Add save button event
    saveBtn.addEventListener('click', async () => {
        try {
            status.textContent = 'Preparing TTL data...'
            showLoading('Preparing TTL data...')
            const ttlContent = await editor.prepareTTLContent()

            // Create download link
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
                hideLoading()
            }, 0)

            status.textContent = 'Saved to transmission.ttl'
        } catch (error) {
            hideLoading()
            status.textContent = `Error: ${error.message}`
            console.error('Save error:', error)
        }
    })

    // Add new transmission button event
    newBtn.addEventListener('click', () => {
        newDialog.style.display = 'block'
    })

    cancelNewBtn.addEventListener('click', () => {
        newDialog.style.display = 'none'
    })

    createNewBtn.addEventListener('click', () => {
        const name = transmissionName.value.trim() || 'New Transmission'
        showLoading(`Creating new transmission: ${name}...`)

        setTimeout(() => {
            editor.createNewTransmission(name)
            newDialog.style.display = 'none'
            status.textContent = `Created new transmission: ${name}`
            hideLoading()
        }, 100) // Small delay to allow loading indicator to appear
    })

    // Add organize button event
    organizeBtn.addEventListener('click', () => {
        try {
            showLoading('Organizing graph...')
            setTimeout(() => {
                editor.getGraph().organize()
                status.textContent = 'Graph organized!'
                hideLoading()
            }, 100) // Small delay to allow loading indicator to appear
        } catch (error) {
            hideLoading()
            status.textContent = `Error: ${error.message}`
            console.error('Organize error:', error)
        }
    })

    // Add sample loading button if present
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', async () => {
            try {
                status.textContent = 'Loading sample file...'
                showLoading('Loading sample file...')
                await loadSampleFile(editor)
                status.textContent = 'Sample file loaded'
                hideLoading()
            } catch (error) {
                hideLoading()
                status.textContent = `Error loading sample: ${error.message}`
                console.error('Sample load error:', error)
            }
        })
    }

    // Handle drag and drop for TTL files
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault()
        e.stopPropagation()
        canvas.classList.add('drag-over')
    })

    canvas.addEventListener('dragleave', (e) => {
        e.preventDefault()
        e.stopPropagation()
        canvas.classList.remove('drag-over')
    })

    canvas.addEventListener('drop', async (e) => {
        e.preventDefault()
        e.stopPropagation()
        canvas.classList.remove('drag-over')

        const files = e.dataTransfer.files
        if (files.length > 0) {
            const file = files[0]
            if (file.name.endsWith('.ttl')) {
                try {
                    status.textContent = `Loading ${file.name}...`
                    showLoading(`Loading ${file.name}...`)

                    const reader = new FileReader()
                    reader.onload = async (event) => {
                        try {
                            const turtleContent = event.target.result
                            const blob = new Blob([turtleContent], { type: 'text/turtle' })
                            const fileURL = URL.createObjectURL(blob)

                            await editor.loadFromFile(fileURL)
                            status.textContent = `Loaded ${file.name}`
                            hideLoading()

                            URL.revokeObjectURL(fileURL)
                        } catch (error) {
                            hideLoading()
                            status.textContent = `Error parsing file: ${error.message}`
                            console.error('Load error:', error)
                        }
                    }

                    reader.readAsText(file)
                } catch (error) {
                    hideLoading()
                    status.textContent = `Error: ${error.message}`
                    console.error('Load error:', error)
                }
            } else {
                status.textContent = 'Please drop a .ttl file'
            }
        }
    })

    // Auto-load sample on startup
    try {
        status.textContent = 'Loading sample file...'
        showLoading('Loading sample file...')
        await loadSampleFile(editor)
        status.textContent = 'Sample file loaded'
        hideLoading()
    } catch (error) {
        hideLoading()
        status.textContent = 'Ready - Click "Load TTL" to open a transmission file'
        console.warn('Could not auto-load sample:', error)
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+O or Cmd+O to open file
        if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
            e.preventDefault()
            loadBtn.click()
        }

        // Ctrl+S or Cmd+S to save file
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault()
            saveBtn.click()
        }

        // Ctrl+N or Cmd+N for new transmission
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault()
            newBtn.click()
        }
    })
})

/**
 * Loads a sample transmission file
 * @param {TransmissionEditor} editor - The transmission editor instance
 */
async function loadSampleFile(editor) {
    const samplePath = 'samples/transmissions.ttl'
    await editor.loadFromFile(samplePath)
}