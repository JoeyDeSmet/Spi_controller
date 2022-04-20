import { Lannooleaf, Color, Graph, Coordinate, CoordMap } from "../lib/index.js";

// const controller = new Lannooleaf();
// await controller.Init();

// await controller.SetAll(new Color(255, 0, 0))

const graph = new Graph();
graph.AddNode(0xff);
graph.AddNode(0x09);

graph.AddEdge(0xff, 1, 0x09);
graph.AddEdge(0x09, 4, 0xff);

console.log(graph);

const map = new CoordMap(graph);

console.log(map);

