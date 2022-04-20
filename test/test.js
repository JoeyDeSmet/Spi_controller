import { Lannooleaf, Color, Graph, Coordinate, CoordMap } from "../lib/index.js";

const controller = new Lannooleaf();
await controller.Init();

// await controller.HelloMessage()
// .then(msg => { console.log(msg); });

const graph = new Graph();
await controller.GetGraph(graph);

const map = new CoordMap(graph);


await controller.Destroy();
