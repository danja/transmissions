import path from 'path';

const LANGUAGE_PATTERNS = {
    js: {
        single: '//',
        multi: { start: '/*', end: '*/' }
    },
    jsx: {
        single: '//',
        multi: { start: '/*', end: '*/' }
    },
    ts: {
        single: '//',
        multi: { start: '/*', end: '*/' }
    },
    tsx: {
        single: '//',
        multi: { start: '/*', end: '*/' }
    },
    py: {
        single: '#',
        multi: { start: '"""', end: '"""' }
    },
    java: {
        single: '//',
        multi: { start: '/*', end: '*/' }
    },
    cpp: {
        single: '//',
        multi: { start: '/*', end: '*/' }
    },
    c: {
        single: '//',
        multi: { start: '/*', end: '*/' }
    },
    h: {
        single: '//',
        multi: { start: '/*', end: '*/' }
    }
};

export function commentStripper(content, filepath) {
    const ext = path.extname(filepath).toLowerCase().slice(1);
    const patterns = LANGUAGE_PATTERNS[ext];

    if (!patterns) {
        return content;
    }

    let lines = content.split('\n');
    let inMultiLineComment = false;
    let result = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (inMultiLineComment) {
            if (line.includes(patterns.multi.end)) {
                inMultiLineComment = false;
                line = line.split(patterns.multi.end)[1];
            } else {
                continue;
            }
        }

        if (patterns.multi && line.includes(patterns.multi.start)) {
            const parts = line.split(patterns.multi.start);
            if (!parts[1].includes(patterns.multi.end)) {
                inMultiLineComment = true;
                line = parts[0];
            } else {
                line = parts[0] + parts[1].split(patterns.multi.end)[1];
            }
        }

        if (patterns.single && line.startsWith(patterns.single)) {
            continue;
        }

        if (patterns.single) {
            const commentIndex = line.indexOf(patterns.single);
            if (commentIndex >= 0) {
                line = line.substring(0, commentIndex).trim();
            }
        }

        if (line.trim()) {
            result.push(line);
        }
    }

    return result.join('\n');
}