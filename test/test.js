import { Lannooleaf, Color, Graph } from "../lib/index.js";

const controller = new Lannooleaf();
await controller.Init();

const graph = new Graph();
await controller.GetAdjList(graph);

var allAddresses = Array.from(graph.map.keys());

// Set the first led of each connected leaf
for (const address of allAddresses) {
  await controller.SetLed(address, 0, new Color(255, 0, 0));
}

// Generate colorsting of 16 with random colors and send to specific unit
var colorString = Array(16).fill(new Color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)));
await controller.SetLedString(allAddresses[0], colorString);

await controller.Destroy();
