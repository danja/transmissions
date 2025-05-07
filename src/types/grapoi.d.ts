import { DatasetCore, Quad, Term } from "@rdfjs/types";

// Grapoi interface
interface Grapoi extends PathList {
    addList(predicates: Term | Term[], items: Term | Term[]): Grapoi;
    addOut(predicates: Term | Term[], objects: Term | Term[], callback?: Function): Grapoi;
    base(base: Term | Term[]): Grapoi;
}

// Edge interface
interface Edge {
    dataset: DatasetCore;
    end: string;
    quad: Quad;
    start: string;
    term: Term;
    graph: Term;
    startTerm: Term;
}

// Instruction interface
interface Instruction {
    operation?: string;
    quantifier?: string;
    start?: string;
    end?: string;
    subjects?: Term[];
    predicates?: Term[];
    objects?: Term[];
    graphs?: DatasetCore[];
    items?: Term[];
    callback?: (edge: Edge, ptr: Path | PathList) => Path | PathList;
}

// Path interface
interface Path {
    addList(predicates: Term | Term[], items: Term | Term[]): Path;
    addOut(predicates: Term | Term[], objects: Term | Term[], callback?: Function): Path;
    deleteIn(predicates: Term | Term[], subjects: Term | Term[]): Path;
    deleteList(predicates: Term | Term[]): Path;
    deleteOut(predicates: Term | Term[], objects: Term | Term[]): Path;
    extend(edge: Edge): Path;
    execute(instruction: Instruction): Path;
}

// PathList interface
interface PathList {
    addList(predicates: Term | Term[], items: Term | Term[]): PathList;
    addOut(predicates: Term | Term[], objects: Term | Term[], callback?: Function): PathList;
    deleteIn(predicates: Term | Term[], subjects: Term | Term[]): PathList;
    deleteList(predicates: Term | Term[]): PathList;
    deleteOut(predicates: Term | Term[], objects: Term | Term[]): PathList;
    distinct(): PathList;
    in(predicates: Term | Term[], subjects: Term | Term[]): PathList;
    isAny(): boolean;
    isList(): boolean;
    list(): Iterator<Term> | undefined;
    map(callback: Function): PathList[];
    out(predicates: Term | Term[], objects: Term | Term[]): PathList;
    quads(): Iterator<Quad>;
    execute(instruction: Instruction): PathList[];
}