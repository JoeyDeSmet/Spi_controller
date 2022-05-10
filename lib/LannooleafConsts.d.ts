import * as spi from 'spi-device';
export declare const Commands: {
    helloMessage: number;
    getAdjListSize: number;
    getAdjList: number;
    setLed: number;
    setAllLeds: number;
    setLedString: number;
    clearLed: number;
    clearAll: number;
};
export declare const HelloMessage: spi.SpiMessage;
export declare const GetOneByteMessage: spi.SpiMessage;
export declare const GetGraphSizeMessage: spi.SpiMessage;
export declare const GetGraphMessage: spi.SpiMessage;
export declare const ClearAllMessage: spi.SpiMessage;
