export const Commands = {
    helloMessage: 0x01,
    getAdjListSize: 0x02,
    getAdjList: 0x03,
    setLed: 0x04,
    setAllLeds: 0x05,
    setLedString: 0x06
};
export const GetOneByteMessage = [{
        byteLength: 1,
        sendBuffer: Buffer.from([0xa5]),
        receiveBuffer: Buffer.alloc(1)
    }];
export const HelloMeassage = [{
        byteLength: 1,
        sendBuffer: Buffer.from([Commands.helloMessage])
    }];
export const GetAdjListSize = [{
        byteLength: 1,
        sendBuffer: Buffer.from([Commands.getAdjListSize])
    }];
export const GetAdjList = [{
        byteLength: 1,
        sendBuffer: Buffer.from([Commands.getAdjList])
    }];
