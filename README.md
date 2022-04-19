# Lannooleaf Spi_controller

Package to comunicate with lannooleaf controller. Send command to change leds all at once or individual ones. Get topology information etc...

# Contents

- [Instalation](#instalation)
- [Usage](#usage)
- [API](#api)

# Instalation

```
npm install lannooleaf_spi_controller
```

# Usage

## Wake up the controller

```js
import { Lannooleaf } from 'lannooleaf_spi_controller';

const controller = new Lannooleaf();

controller.wake();
```

**Note**: Wake should only be called when lannooleaf is in idle state and is not configured, when calling wake when contoller is already initialized unexpected behaviour may apear.

## Send other command to controller

```js
import { Lanooleaf, Color, Graph } from 'lannooleaf_spi_controller';

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
```

# API

## Lannooleaf class
- [controller.Init()](#controllerinit)
- [controller.Destroy()](#controllerdestroy)
- [controller.Wake()](#controllerwake)
- [controller.HelloMeassage()](#controllerhellomessage)
- [controll.GetGraph(graph)](#controllergetgraphgraph)

### controller.Init()

Initialize the controller after creating a object of Lannooleaf.

### controller.Destroy()

Cleans up Lannooleaf

### controller.Wake()

Sends a wake signal to lannooleaf to start device/topology discovery.

**NOTE**: This should only be called once when lannooleaf has not been woken yes, unexprected behaviour may apear when calling Wake() when lannooleaf is already woken.

### controller.HelloMessage()

Send a hello message to lannooleaf

**Returns**: A string promise that sould read 'HelloSpi!'

### controller.GetGraph(graph)

Get the graph from lannooleaf

* Parameter graph: Graph object where to add nodes and edges


