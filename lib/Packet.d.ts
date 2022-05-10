/// <reference types="node" />
export declare class Packet {
    private read;
    private command;
    data: Array<number>;
    constructor(read: Boolean, command: number, data: Array<number>);
    ToBuffer(): Buffer;
    Size(): number;
    CheckCheckSum(received: number): Boolean;
    private Checksum;
}
