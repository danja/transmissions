import './editor.css'
import { TransmissionEditor } from './components/index.js'
import CustomNodeRenderer from './components/CustomNodeRenderer.js'

// Import required dependencies for the browser environment
import grapoi from 'grapoi'
import rdfExt from '../../utils/browser-rdf-ext.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import ns from '../../utils/ns.js'

// Set up global objects for debugging
window.isBrowserEnvironment = true
window.transmissionsDebug = true
window.grapoi = grapoi
window.rdfExt = rdfExt
window.GrapoiHelpers = GrapoiHelpers
window.ns = ns
window.grapoiLoaded = true

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the editor with the canvas element
    const canvas = document.getElementById('canvas')
    if (!canvas) {
        console.error('Canvas element not found')
        return
    }

    // Create the editor instance
    const editor = new TransmissionEditor(canvas)
    window.transmissionsEditor = editor // Make it globally accessible for debugging

    // Set up UI elements
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

    // Show instructions on first visit
    if (!localStorage.getItem('transmissionsEditorInstructionsShown')) {
        instructions.classList.add('show')
        localStorage.setItem('transmissionsEditorInstructionsShown', 'true')
    }

    // Close instructions handler
    if (closeInstructionsBtn) {
        closeInstructionsBtn.addEventListener('click', () => {
            instructions.classList.remove('show')
        })
    }

    // Load file button handler
    loadBtn.addEventListener('click', () => {
        fileInput.click()
    })

    // Loading indicator functions
    function showLoading(message) {
        loadingMessage.textContent = message
        loadingEl.style.display = 'flex'
    }

    function hideLoading() {
        loadingEl.style.display = 'none'
    }

    // File input change handler
    fileInput.addEventListener('change', async (e) => {
        console.log(`File input change event triggered`, e)
        const file = e.target.files[0]
        if (file) {
            try {
                status.textContent = `Loading ${file.name}...`
                showLoading(`Loading ${file.name}...`)
                console.log(`Loading file: ${file.name}`)

                // Read the file contents
                const reader = new FileReader()

                reader.onload = async (event) => {
                    try {
                        console.log(`File content loaded, creating blob URL`)

                        const turtleContent = event.target.result
                        const blob = new Blob([turtleContent], { type: 'text/turtle' })
                        const fileURL = URL.createObjectURL(blob)

                        // Load the file into the editor
                        console.log(`Loading from blob URL: ${fileURL}`)
                        await editor.loadFromFile(fileURL)
                        status.textContent = `Loaded ${file.name}`
                        hideLoading()

                        // Clean up the blob URL
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

                // Start reading the file
                reader.readAsText(file)
            } catch (error) {
                hideLoading()
                status.textContent = `Error: ${error.message}`
                console.error('Load error:', error)
            }
        }

        // Reset the input to allow loading the same file again
        fileInput.value = ''
    })

    // Save button event handler
    saveBtn.addEventListener('click', async () => {
        try {
            status.textContent = 'Preparing TTL data...'
            showLoading('Preparing TTL data...')
            const ttlContent = await editor.prepareTTLContent()

            // Create a download for the TTL content
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

    // New transmission dialog handlers
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
        }, 100)
    })

    // Organize graph button handler
    organizeBtn.addEventListener('click', () => {
        try {
            showLoading('Organizing graph...')
            setTimeout(() => {
                editor.getGraph().organize()
                status.textContent = 'Graph organized!'
                hideLoading()
            }, 100)
        } catch (error) {
            hideLoading()
            status.textContent = `Error: ${error.message}`
            console.error('Organize error:', error)
        }
    })

    // Load sample button handler
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

    // Set up drag and drop handlers for TTL files
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

    // Auto-load sample file on startup
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

    // Set up keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+O / Cmd+O to open file
        if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
            e.preventDefault()
            loadBtn.click()
        }

        // Ctrl+S / Cmd+S to save file
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault()
            saveBtn.click()
        }

        // Ctrl+N / Cmd+N to create new transmission
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault()
            newBtn.click()
        }
    })
})

// Load a sample file
async function loadSampleFile(editor) {
    const samplePath = 'samples/transmissions.ttl'
    await editor.loadFromFile(samplePath)
}