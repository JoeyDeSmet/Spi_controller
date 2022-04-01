const spi = require('spi-device');
const gpio = require("rpi-gpio").promise;

const Lannooleaf = spi.open(0, 0, err => {
  if (err) throw err;
});

async function main() {

  await gpio.setup(8, gpio.DIR_OUT).catch(error => { console.error(error); });
  

}

main();