"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdjList = exports.GetAdjListSize = exports.HelloMeassage = exports.GetOneByteMessage = exports.Commands = void 0;
exports.Commands = {
    helloMessage: 0x01,
    getAdjListSize: 0x02,
    getAdjList: 0x03,
    setLed: 0x04,
    setAllLeds: 0x05,
    setLedString: 0x06
};
exports.GetOneByteMessage = [{
        byteLength: 1,
        sendBuffer: Buffer.from([0xa5]),
        receiveBuffer: Buffer.alloc(1)
    }];
exports.HelloMeassage = [{
        byteLength: 1,
        sendBuffer: Buffer.from([exports.Commands.helloMessage])
    }];
exports.GetAdjListSize = [{
        byteLength: 1,
        sendBuffer: Buffer.from([exports.Commands.getAdjListSize])
    }];
exports.GetAdjList = [{
        byteLength: 1,
        sendBuffer: Buffer.from([exports.Commands.getAdjList])
    }];
