import { Lannooleaf, Color } from '../lib/index.js';

const controller = new Lannooleaf();

await controller.Init();

console.log(await controller.HelloMessage());

let graph = await controller.GetGraph();

console.log(graph);

await controller.Destroy();
