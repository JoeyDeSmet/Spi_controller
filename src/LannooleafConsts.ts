import * as spi from 'spi-device';

export const Commands = {
  helloMessage: 0x01,
  getAdjListSize: 0x02,
  getAdjList: 0x03,
  setLed: 0x04,
  setAllLeds: 0x05,
  setLedString: 0x06,
  clearLed: 0x07,
  clearAll: 0x08
}

export const GetOneByteMessage: spi.SpiMessage = [{
  byteLength: 1,
  sendBuffer: Buffer.from([0xa5]),
}];

export const HelloMessage: spi.SpiMessage = [{
  byteLength: 1,
  sendBuffer: Buffer.from([Commands.helloMessage])
}];

export const GetGraphSizeMessage: spi.SpiMessage = [{
  byteLength: 1,
  sendBuffer: Buffer.from([Commands.getAdjListSize])
}];

export const GetGraphMessage: spi.SpiMessage = [{
  byteLength: 1,
  sendBuffer: Buffer.from([Commands.getAdjList])
}];

export const ClearAllMessage: spi.SpiMessage = [{
  byteLength: 1,
  sendBuffer: Buffer.from([Commands.clearAll])
}];
