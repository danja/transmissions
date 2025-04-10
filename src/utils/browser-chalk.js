/**
 * Browser-compatible mock for chalk
 * Provides styling methods that work in browser console
 */

// CSS for console styles
const styles = {
    reset: 'color: inherit; background: inherit;',
    bold: 'font-weight: bold;',
    dim: 'opacity: 0.8;',
    italic: 'font-style: italic;',
    underline: 'text-decoration: underline;',
    inverse: 'color: black; background: white;',
    hidden: 'visibility: hidden;',
    strikethrough: 'text-decoration: line-through;',

    // Colors
    black: 'color: black;',
    red: 'color: red;',
    green: 'color: green;',
    yellow: 'color: #f0ad4e;',
    blue: 'color: blue;',
    magenta: 'color: magenta;',
    cyan: 'color: cyan;',
    white: 'color: white;',
    gray: 'color: gray;',

    // Bright colors
    blackBright: 'color: #555;',
    redBright: 'color: #ff5f5f;',
    greenBright: 'color: #00FF00;',
    yellowBright: 'color: #ffff00;',
    blueBright: 'color: #5f5fff;',
    magentaBright: 'color: #ff5fff;',
    cyanBright: 'color: #5fffff;',
    whiteBright: 'color: #ffffff;',

    // Background colors
    bgBlack: 'background: black;',
    bgRed: 'background: red;',
    bgGreen: 'background: green;',
    bgYellow: 'background: yellow;',
    bgBlue: 'background: blue;',
    bgMagenta: 'background: magenta;',
    bgCyan: 'background: cyan;',
    bgWhite: 'background: white;'
}

/**
 * Creates a styling function
 * @param {Array} styleList - List of styles to apply
 * @returns {Function} - Styling function
 */
function createStyleFunction(styleList) {
    return (text) => {
        const style = styleList.join(' ')
        // For console.log with %c format
        return [`%c${text}`, style]
    }
}

// The base chalk object
const chalk = {}

// Add simple styles
Object.entries(styles).forEach(([name, style]) => {
    Object.defineProperty(chalk, name, {
        get() {
            const styleFunc = createStyleFunction([style])

            // Add chaining support
            Object.entries(styles).forEach(([subName, subStyle]) => {
                Object.defineProperty(styleFunc, subName, {
                    get() {
                        return createStyleFunction([style, subStyle])
                    }
                })
            })

            return (text) => styleFunc(text)[0]
        }
    })
})

// Add special properties for background colors
const bgColors = {}
Object.entries(styles)
    .filter(([name]) => name.startsWith('bg'))
    .forEach(([name, style]) => {
        bgColors[name] = style
    })

// Add nested styles (like chalk.red.bold)
Object.entries(styles)
    .filter(([name]) => !name.startsWith('bg'))
    .forEach(([name, style]) => {
        chalk[name] = (text) => `%c${text}`
        chalk[name].style = style

        // Add background modifiers
        Object.entries(bgColors).forEach(([bgName, bgStyle]) => {
            chalk[name][bgName] = (text) => `%c${text}`
            chalk[name][bgName].style = `${style} ${bgStyle}`
        })
    })

export default chalk