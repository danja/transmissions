import fs from 'fs/promises';
import path from 'path';
import { Command } from 'commander';
import inquirer from 'inquirer';
import { rdf, namespace } from '@rdfjs/data-model';
import { Writer } from 'n3';

const ns = {
    trm: namespace('http://purl.org/stuff/transmission/'),
    prj: namespace('http://purl.org/stuff/project/'),
    app: namespace('http://example.org/app/')
};

class TemplateGenerator {
    constructor() {
        this.program = new Command();
        this.setupCommands();
    }

    setupCommands() {
        this.program
            .name('trans-template')
            .description('Generate Transmissions application templates')
            .version('1.0.0');

        this.program
            .command('create')
            .description('Create new application templates')
            .argument('<name>', 'Application name')
            .option('-f, --format <format>', 'Output format (json|turtle|markdown)', 'json')
            .action(async (name, options) => {
                const answers = await this.promptForDetails(name);
                await this.generateTemplates(name, answers, options.format);
            });
    }

    async promptForDetails(name) {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'primaryGoal',
                message: 'What is the primary goal of this application?'
            },
            {
                type: 'input',
                name: 'inputs',
                message: 'Input formats (comma-separated):',
                filter: input => input.split(',').map(i => i.trim())
            },
            {
                type: 'input',
                name: 'outputs',
                message: 'Output formats (comma-separated):',
                filter: input => input.split(',').map(i => i.trim())
            },
            {
                type: 'input',
                name: 'processors',
                message: 'Required processors (comma-separated):',
                filter: input => input.split(',').map(i => i.trim())
            },
            {
                type: 'confirm',
                name: 'needsTests',
                message: 'Generate test templates?',
                default: true
            }
        ]);
    }

    async generateTemplates(name, answers, format) {
        const outputDir = path.join(process.cwd(), name);
        await fs.mkdir(outputDir, { recursive: true });

        const templates = {
            json: () => this.generateJSON(name, answers),
            turtle: () => this.generateTurtle(name, answers),
            markdown: () => this.generateMarkdown(name, answers)
        };

        const content = templates[format]();
        const fileExt = format === 'turtle' ? 'ttl' : format;
        
        await fs.writeFile(
            path.join(outputDir, `app-definition.${fileExt}`),
            content
        );

        // Generate basic file structure
        await this.generateFileStructure(outputDir, answers);

        console.log(`Generated ${format} template in ${outputDir}`);
    }

    generateJSON(name, answers) {
        return JSON.stringify({
            appName: name,
            purpose: {
                primaryGoal: answers.primaryGoal,
                inputs: answers.inputs,
                outputs: answers.outputs
            },
            processingRequirements: {
                steps: answers.processors.map(p => ({
                    name: p,
                    processor: p,
                    config: {}
                }))
            },
            testing: {
                unitTests: answers.processors.map(p => ({
                    component: p,
                    cases: ['basic', 'error']
                }))
            }
        }, null, 2);
    }

    generateTurtle(name, answers) {
        const writer = new Writer();
        const app = ns.app(name);

        writer.addQuad(
            app,
            ns.trm('title'),
            rdf.literal(name)
        );

        writer.addQuad(
            app,
            ns.trm('primaryGoal'),
            rdf.literal(answers.primaryGoal)
        );

        answers.processors.forEach(p => {
            const proc = ns.app(p);
            writer.addQuad(
                app,
                ns.trm('hasProcessor'),
                proc
            );
        });

        return writer.toString();
    }

    generateMarkdown(name, answers) {
        return `# ${name}

## Purpose
${answers.primaryGoal}

## Inputs
${answers.inputs.map(i => `- ${i}`).join('\n')}

## Outputs
${answers.outputs.map(o => `- ${o}`).join('\n')}

## Processors
${answers.processors.map(p => `- ${p}`).join('\n')}

## Testing
${answers.needsTests ? '- Unit tests required\n- Integration tests required' : 'No tests specified'}
`;
    }

    async generateFileStructure(outputDir, answers) {
        const dirs = [
            'processors',
            'tests',
            'config'
        ];

        for (const dir of dirs) {
            await fs.mkdir(path.join(outputDir, dir), { recursive: true });
        }

        // Create basic files
        const files = {
            'transmissions.ttl': '',
            'config.ttl': '',
            'about.md': `# ${path.basename(outputDir)}\n\n${answers.primaryGoal}`
        };

        for (const [file, content] of Object.entries(files)) {
            await fs.writeFile(
                path.join(outputDir, file),
                content
            );
        }
    }

    run() {
        this.program.parse();
    }
}

export default TemplateGenerator;
