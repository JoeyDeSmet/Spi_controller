# Lannooleaf Spi_controller

Package to comunicate with lannooleaf controller. Send command to change leds all at once or individual ones. Get topology information etc...

# Contents

- [Instalation](#instalation)

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
import { Lanooleaf, Color } from 'lannooleaf_spi_controller';

const conroller = new Lannooleaf();
var adjList;

await controller.Init();
await controller.GetAdjList().then(list => {
  // Get the adjecenty list from controller
  adjList = list;
});



var red = new Color(255, 0, 0);

// Sets all led to red
controller.SetAll(red);

await controller.Destroy();
```