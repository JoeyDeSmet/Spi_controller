import Color from './Color.js';
import { ColorString } from './Color.js';
import Graph from './Graph.js';
export default class Lannooleaf {
    private spi_controller;
    private cs;
    constructor();
    Init(): Promise<void>;
    Destroy(): Promise<void>;
    HelloMessage(): Promise<string>;
    GetAdjList(): Promise<Graph>;
    SetLed(address: number, led: number, color: Color): Promise<void>;
    SetAll(color: Color): Promise<void>;
    SetLedString(address: number, ledstring: ColorString): Promise<void>;
    private GetData;
    private SendAndResolve;
    private GetAdjListSize;
    private GetOneByte;
    private WaitForDataBegin;
}