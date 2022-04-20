import { Graph } from "./Graph.js";
export declare class Led {
    address: number;
    led: number;
    constructor(address: number, led: number);
}
export declare class Coordinate {
    x: number;
    y: number;
    constructor(x: number, y: number);
    isEqual(cor: Coordinate): Boolean;
    Add(cor: Coordinate): void;
}
export declare class CoordMap {
    coordMap: Map<Coordinate, Led>;
    constructor(graph: Graph);
    coordToJson(): string;
}
