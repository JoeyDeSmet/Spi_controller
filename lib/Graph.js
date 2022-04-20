export class Leaf {
    constructor(address) {
        this.address = address;
        this.adj = new Map();
    }
}
export class Graph {
    constructor() {
        this.map = new Map();
    }
    AddNode(address) {
        if (!this.map.has(address)) {
            this.map.set(address, new Leaf(address));
        }
    }
    AddEdge(from, from_side, to) {
        if (this.map.has(from) && this.map.has(to)) {
            let from_leaf = this.map.get(from);
            let to_leaf = this.map.get(to);
            from_leaf === null || from_leaf === void 0 ? void 0 : from_leaf.adj.set(from_side, to_leaf);
        }
    }
    Get() {
        if (this.map.has(0xff)) {
            return this.map.get(0xff);
        }
        else {
            return new Leaf(404);
        }
    }
}
