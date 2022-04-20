import { Graph, Coordinate, CoordMap } from "../lib/index.js";

const graph = new Graph();

graph.AddNode(0xff);
graph.AddNode(0x09);

graph.AddEdge(0xff, 1, 0x09);
graph.AddEdge(0x09, 4, 0xff);

var coordMap = new CoordMap(graph);

console.log(coordMap);


