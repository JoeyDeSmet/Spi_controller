import { Lannooleaf, Color, Graph, Coordinate, CoordMap } from "../lib/index.js";

const controller = new Lannooleaf();
await controller.Init();

const graph = new Graph();
await controller.GetGraph(graph);

const corMap = new CoordMap(graph);

await controller.SetAll(new Color(0, 0, 0));

for (var key of graph.map.keys()) {
  if (key != 255) {
    for (var i = 0; i < key; i++) {
      console.log("setting led " + i + " of " + key);
      await controller.SetLed(key, i, new Color(100, 50, 0));
      await new Promise(resolve => { setTimeout(resolve, 50); });
    }
  }
}

await controller.Destroy();
