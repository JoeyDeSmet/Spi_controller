"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Leaf = /** @class */ (function () {
    function Leaf(address) {
        this.address = address;
        this.adj = new Map();
    }
    return Leaf;
}());
var Graph = /** @class */ (function () {
    function Graph() {
        this.map = new Map();
    }
    Graph.prototype.AddNode = function (address) {
        if (!this.map.has(address)) {
            this.map.set(address, new Leaf(address));
        }
    };
    Graph.prototype.AddEdge = function (from, from_side, to) {
        if (this.map.has(from) && this.map.has(to)) {
            var from_leaf = this.map.get(from);
            var to_leaf = this.map.get(to);
            from_leaf === null || from_leaf === void 0 ? void 0 : from_leaf.adj.set(from_side, to_leaf);
        }
    };
    Graph.prototype.Get = function () {
        if (this.map.has(0xff)) {
            return this.map.get(0xff);
        }
        else {
            return new Leaf(404);
        }
    };
    return Graph;
}());
exports.default = Graph;
