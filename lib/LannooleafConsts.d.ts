import * as spi from 'spi-device';
export declare const Commands: {
    helloMessage: number;
    getAdjListSize: number;
    getAdjList: number;
    setLed: number;
    setAllLeds: number;
    setLedString: number;
};
export declare const GetOneByteMessage: spi.SpiMessage;
export declare const HelloMeassage: spi.SpiMessage;
export declare const GetAdjListSize: spi.SpiMessage;
export declare const GetAdjList: spi.SpiMessage;
