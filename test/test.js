import { Lannooleaf, Color, Graph, Coordinate, CoordMap } from "../lib/index.js";

const controller = new Lannooleaf();
await controller.Init();

const graph = new Graph();
await controller.GetGraph(graph);

const corMap = new CoordMap(graph);
console.log(corMap.coordToJson()); 

var units = [...graph.map.keys()];

for (var address of units) {
  var randomLedString = Array.from({ length: 16 }, () => { return new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)); });
  await controller.SetLedString(address, randomLedString);
}

await new Promise(resolve => { setTimeout(resolve, 1000); });

await controller.Destroy();
