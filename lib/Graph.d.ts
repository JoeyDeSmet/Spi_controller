declare type i2c_address = number;
declare type side = number;
declare class Leaf {
    address: number;
    adj: Map<side, Leaf>;
    constructor(address: number);
}
export default class Graph {
    map: Map<i2c_address, Leaf>;
    constructor();
    AddNode(address: i2c_address): void;
    AddEdge(from: i2c_address, from_side: side, to: i2c_address): void;
    Get(): Leaf;
}
export {};
