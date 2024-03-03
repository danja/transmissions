import { namedNode, literal } from '@rdfjs/data-model';
import { Grapoi } from '@grapoi';
import { Term } from '@rdfjs/types';

describe('Grapoi', () => {
    let grapoi;

    beforeEach(() => {
        grapoi = new Grapoi();
    });

    describe('.addList', () => {
        it('should return a Grapoi instance', () => {
            // Create actual Term instances based on housemd.js data
            const predicates: Term[] = [namedNode('https://housemd.rdf-ext.org/person/allison-cameron'), namedNode('http://schema.org/knows')];
            const items: Term[] = [namedNode('https://housemd.rdf-ext.org/person/robert-chase')];

            const result = grapoi.addList(predicates, items);

            expect(result).toBeInstanceOf(Grapoi);
        });
    });

    // Continue with other functions...
});

////

import { namedNode, literal } from '@rdfjs/data-model';
import { Grapoi } from '@grapoi';
import { Term } from '@rdfjs/types';

describe('Grapoi', () => {
    let grapoi;

    beforeEach(() => {
        grapoi = new Grapoi();
    });

    describe('.addList', () => {
        it('should return a Grapoi instance', () => {
            const predicates: Term[] = [namedNode('https://housemd.rdf-ext.org/person/allison-cameron'), namedNode('http://schema.org/knows')];
            const items: Term[] = [namedNode('https://housemd.rdf-ext.org/person/robert-chase')];

            const result = grapoi.addList(predicates, items);

            expect(result).toBeInstanceOf(Grapoi);
        });
    });

    describe('.addOut', () => {
        it('should return a Grapoi instance', () => {
            const predicates: Term[] = [namedNode('https://housemd.rdf-ext.org/person/allison-cameron'), namedNode('http://schema.org/knows')];
            const objects: Term[] = [namedNode('https://housemd.rdf-ext.org/person/robert-chase')];

            const result = grapoi.addOut(predicates, objects);

            expect(result).toBeInstanceOf(Grapoi);
        });
    });

    // Continue with other functions...
});

////


describe('.base', () => {
    it('should return a Grapoi instance', () => {
        const base: Term = namedNode('https://housemd.rdf-ext.org/person/allison-cameron');

        const result = grapoi.base(base);

        expect(result).toBeInstanceOf(Grapoi);
    });
});

/////

import { namedNode, literal } from '@rdfjs/data-model';
import { Path } from '@grapoi';
import { Term } from '@rdfjs/types';

describe('Path', () => {
    let path;

    beforeEach(() => {
        path = new Path();
    });

    describe('.addList', () => {
        it('should return a Path instance', () => {
            const predicates: Term[] = [namedNode('https://housemd.rdf-ext.org/person/allison-cameron'), namedNode('http://schema.org/knows')];
            const items: Term[] = [namedNode('https://housemd.rdf-ext.org/person/robert-chase')];

            const result = path.addList(predicates, items);

            expect(result).toBeInstanceOf(Path);
        });
    });

    // Continue with other functions...
});

////

import { namedNode, literal } from '@rdfjs/data-model';
import { PathList } from '@grapoi';
import { Term } from '@rdfjs/types';

describe('PathList', () => {
    let pathList;

    beforeEach(() => {
        pathList = new PathList();
    });

    describe('.addList', () => {
        it('should return a PathList instance', () => {
            const predicates: Term[] = [namedNode('https://housemd.rdf-ext.org/person/allison-cameron'), namedNode('http://schema.org/knows')];
            const items: Term[] = [namedNode('https://housemd.rdf-ext.org/person/robert-chase')];

            const result = pathList.addList(predicates, items);

            expect(result).toBeInstanceOf(PathList);
        });
    });

    // Continue with other functions...
});

////

// Continue from previous tests...

describe('.addOut', () => {
    it('should return a Path instance', () => {
        const predicates: Term[] = [namedNode('https://housemd.rdf-ext.org/person/allison-cameron'), namedNode('http://schema.org/knows')];
        const objects: Term[] = [namedNode('https://housemd.rdf-ext.org/person/robert-chase')];

        const result = path.addOut(predicates, objects);

        expect(result).toBeInstanceOf(Path);
    });
});

// Continue with other functions...

// Continue from previous tests...

describe('.addOut', () => {
    it('should return a PathList instance', () => {
        const predicates: Term[] = [namedNode('https://housemd.rdf-ext.org/person/allison-cameron'), namedNode('http://schema.org/knows')];
        const objects: Term[] = [namedNode('https://housemd.rdf-ext.org/person/robert-chase')];

        const result = pathList.addOut(predicates, objects);

        expect(result).toBeInstanceOf(PathList);
    });
});

// Continue with other functions...

// Continue from previous tests...

describe('.deleteIn', () => {
    it('should return a Path instance', () => {
        const predicates: Term[] = [namedNode('https://housemd.rdf-ext.org/person/allison-cameron'), namedNode('http://schema.org/knows')];

        const result = path.deleteIn(predicates);

        expect(result).toBeInstanceOf(Path);
    });
});

// Continue with other functions...

// Continue from previous tests...

describe('.deleteIn', () => {
    it('should return a PathList instance', () => {
        const predicates: Term[] = [namedNode('https://housemd.rdf-ext.org/person/allison-cameron'), namedNode('http://schema.org/knows')];

        const result = pathList.deleteIn(predicates);

        expect(result).toBeInstanceOf(PathList);
    });
});

// Continue with other functions...






