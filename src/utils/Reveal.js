export class Reveal {

    static serialize(instance) {
        const serialized = {};
        for (const key in instance) {
            if (instance.hasOwnProperty(key)) {
                serialized[key] = instance[key];
            }
        }
        // console.log(JSON.stringify(serialized));
    }

    static asJSON(instance) {
        const serialized = this.serialize(instance)
        return JSON.stringify(serialized);
        //  return instance.constructor.name; ClassName
    }

    static asMarkdown(instance) {
        const serialized = Reveal.serialize(instance)
        // console.log(JSON.stringify(serialized));
        return `\n# ${instance.constructor.name}\n\n\`\`\`\n${serialized}\n\`\`\``
        return JSON.stringify(serialized);
        //  return instance.constructor.name; ClassName
    }
}
