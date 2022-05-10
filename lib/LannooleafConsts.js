export const Commands = {
    helloMessage: 0x01,
    getAdjListSize: 0x02,
    getAdjList: 0x03,
    setLed: 0x04,
    setAllLeds: 0x05,
    setLedString: 0x06,
    clearLed: 0x07,
    clearAll: 0x08
};
export const HelloMessage = [{
        byteLength: 1,
        sendBuffer: Buffer.from([Commands.helloMessage])
    }];
export const GetOneByteMessage = [{
        byteLength: 1,
        sendBuffer: Buffer.from([0xff]),
        receiveBuffer: Buffer.alloc(1)
    }];
export const GetGraphSizeMessage = [{
        byteLength: 1,
        sendBuffer: Buffer.from([Commands.getAdjListSize])
    }];
export const GetGraphMessage = [{
        byteLength: 1,
        sendBuffer: Buffer.from([Commands.getAdjList])
    }];
export const ClearAllMessage = [{
        byteLength: 1,
        sendBuffer: Buffer.from([Commands.clearAll])
    }];
