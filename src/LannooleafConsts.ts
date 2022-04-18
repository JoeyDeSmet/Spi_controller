import * as spi from 'spi-device';

export const Commands = {
  helloMessage: 0x01,
  getAdjListSize: 0x02,
  getAdjList: 0x03,
  setLed: 0x04,
  setAllLeds: 0x05,
  setLedString: 0x06
}

export const GetOneByteMessage: spi.SpiMessage = [{
  byteLength: 1,
  sendBuffer: Buffer.from([0xa5]),
  receiveBuffer: Buffer.alloc(1)
}];

export const HelloMeassage: spi.SpiMessage = [{
  byteLength: 1,
  sendBuffer: Buffer.from([Commands.helloMessage])
}];

export const GetAdjListSize: spi.SpiMessage = [{
  byteLength: 1,
  sendBuffer: Buffer.from([Commands.getAdjListSize])
}];

export const GetAdjList: spi.SpiMessage = [{
  byteLength: 1,
  sendBuffer: Buffer.from([Commands.getAdjList])
}];
