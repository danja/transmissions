import logger from './Logger.js'

class JSONUtils {
    /* these functions might already be built into JS, but I couldn't find it

    for docs :

    const a = {
    b: {
        c: 5
    }
};

console.log(find(a, "b.c")); // Output: 5
console.log(find(a, "b.d")); // Output: undefined (key doesn't exist)

const a = {
    b: {
        c: [10, 20, 30],
        d: {
            e: [40, 50]
        }
    }
};
    console.log(find(a, "b.c[1]")); // Output: 20
    console.log(find(a, "b.d.e[0]")); // Output: 40
    console.log(find(a, "b.c[3]")); // Output: undefined (index out of bounds)
    console.log(find(a, "b.d.f[0]")); // Output: undefined (key doesn't exist)
    */

    static get(obj, path) {
        return JSONUtils.find(obj, path, false, false)
    }

    static set(obj, path, value) {
        JSONUtils.find(obj, path, value, false)
        return obj
    }

    static remove(obj, path) {
        JSONUtils.find(obj, path, false, true)
        return obj
    }

    static find(obj, path, setValue = false, remove = false) {
        // TODO I don't think set() is working for nested.objects - make tests, fix
        // meanwhile, simplest case
        if (setValue && !path.includes('.')) {
            //    logger.debug(`setting ${path} = ${setValue}`)
            obj[path] = setValue
        }

        const keys = path.split('.')
        let result = obj

        // Traverse the object to the second-to-last key
        for (let i = 0; i < keys.length - 1; i++) {
            let key = keys[i]

            // Handle array indices (e.g., "c[0]")
            const arrayMatch = key.match(/^(.*)\[(\d+)\]$/)
            if (arrayMatch) {
                key = arrayMatch[1]
                const index = parseInt(arrayMatch[2], 10)
                if (result && typeof result === 'object' && key in result && Array.isArray(result[key])) {
                    result = result[key][index]
                } else {
                    return undefined // Invalid path
                }
            } else {
                if (result && typeof result === 'object' && key in result) {
                    result = result[key]
                } else {
                    return undefined // Invalid path
                }
            }
        }

        // Handle the last key
        const lastKey = keys[keys.length - 1]
        const lastKeyArrayMatch = lastKey.match(/^(.*)\[(\d+)\]$/)

        // TODO simplify
        if (lastKeyArrayMatch) {
            const arrayKey = lastKeyArrayMatch[1]
            const index = parseInt(lastKeyArrayMatch[2], 10)

            if (result && typeof result === 'object' && arrayKey in result && Array.isArray(result[arrayKey])) {
                if (remove) {
                    // Remove the element from the array
                    result[arrayKey].splice(index, 1)
                    return true // Indicate success
                } else {

                    if (setValue) {
                        result[arrayKey][index] = setValue
                        return true
                    }
                    return result[arrayKey][index] // Return the element
                }
            } else {
                return undefined // Invalid path
            }
        } else {
            // Handle regular keys for the last key
            if (result && typeof result === 'object' && lastKey in result) {
                if (remove) {
                    // Remove the key from the object
                    delete result[lastKey]
                    return true // Indicate success
                } else {
                    if (setValue) {
                        result[lastKey] = setValue
                        return true
                    }
                    return result[lastKey] // Return the value
                }
            } else {
                return undefined // Invalid path
            }
        }
    }

}
export default JSONUtils