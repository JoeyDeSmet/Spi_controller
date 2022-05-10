import { Color } from './Color.js';
import { ColorString } from './Color.js';
import { Graph } from './Graph.js';
export declare class Lannooleaf {
    private spi_controller;
    private cs;
    constructor();
    Init(): Promise<void>;
    Destroy(): Promise<void>;
    Wake(): Promise<void>;
    HelloMessage(): Promise<string>;
    GetGraph(): Promise<Graph>;
    SetLed(address: number, led: number, color: Color): Promise<void>;
    SetAll(color: Color): Promise<void>;
    SetLedString(address: number, ledstring: ColorString): Promise<void>;
    ClearLed(address: number, led: number): Promise<void>;
    ClearAll(): Promise<void>;
    private GetOneByte;
    private SendPacket;
    private GetPacket;
}
