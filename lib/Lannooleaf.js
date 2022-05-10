var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import spi from 'spi-device';
import { Gpio } from 'onoff';
import * as lannooleafconst from './LannooleafConsts.js';
import { Graph } from './Graph.js';
import { Packet } from './Packet.js';
export class Lannooleaf {
    constructor() {
        this.cs = new Gpio(25, 'out');
        this.spi_controller = null;
    }
    Init() {
        return new Promise(resolve => {
            this.spi_controller = spi.open(0, 0, error => {
                if (error)
                    throw error;
                this.spi_controller.setOptions({
                    mode: 3,
                    maxSpeedHz: 2000000,
                    noChipSelect: true
                }, error => { if (error)
                    throw error; resolve(); });
            });
        });
    }
    Destroy() {
        return new Promise(reslove => {
            this.cs.unexport();
            this.spi_controller.close(error => {
                if (error)
                    throw error;
                reslove();
            });
        });
    }
    Wake() {
        return new Promise(resolve => {
            this.cs.write(0).then(() => {
                this.cs.write(1).then(() => {
                    resolve();
                });
            });
        });
    }
    HelloMessage() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let pkt = this.GetPacket(lannooleafconst.Commands.helloMessage);
            resolve(String.fromCharCode(...(yield pkt).data));
        }));
    }
    GetGraph() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let graph = new Graph();
            let pkt = yield this.GetPacket(lannooleafconst.Commands.getAdjList);
            let index = 0;
            while (pkt.data[index] != 0x00) {
                console.log("adding node");
                graph.AddNode(pkt.data[index]);
                index++;
            }
            index++;
            for (index; index < pkt.data.length; index += 3) {
                console.log("Adding edge");
                graph.AddEdge(pkt.data[index], pkt.data[index + 1], pkt.data[index + 2]);
            }
            resolve(graph);
        }));
    }
    SetLed(address, led, color) {
        let pkt = new Packet(false, lannooleafconst.Commands.setLed, [
            address,
            led,
            color.red,
            color.green,
            color.blue
        ]);
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.SendPacket(pkt);
            resolve();
        }));
    }
    SetAll(color) {
        let pkt = new Packet(false, lannooleafconst.Commands.setAllLeds, [
            color.red,
            color.green,
            color.blue
        ]);
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.SendPacket(pkt);
            resolve();
        }));
    }
    SetLedString(address, ledstring) {
        if (ledstring.length > 16)
            throw new Error("Ledstring can only be of size 16 or less");
        let data = [address];
        for (var color of ledstring) {
            data.push(color.red);
            data.push(color.green);
            data.push(color.blue);
        }
        let pkt = new Packet(false, lannooleafconst.Commands.setLedString, data);
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.SendPacket(pkt);
            resolve();
        }));
    }
    ClearLed(address, led) {
        let pkt = new Packet(false, lannooleafconst.Commands.clearLed, [
            address,
            led
        ]);
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.SendPacket(pkt);
            resolve();
        }));
    }
    ClearAll() {
        let pkt = new Packet(false, lannooleafconst.Commands.clearAll, []);
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.SendPacket(pkt);
            resolve();
        }));
    }
    GetOneByte() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            this.cs.write(0);
            this.spi_controller.transfer(lannooleafconst.GetOneByteMessage, (error, message) => {
                if (error)
                    throw error;
                this.cs.write(1);
                resolve(message[0].receiveBuffer[0]);
            });
        }));
    }
    SendPacket(pkt) {
        let message = [{
                byteLength: pkt.Size(),
                sendBuffer: pkt.ToBuffer()
            }];
        return new Promise(resolve => {
            this.cs.writeSync(0);
            this.spi_controller.transfer(message, (error, message) => {
                if (error)
                    throw error;
                this.cs.writeSync(1);
                resolve();
            });
        });
    }
    GetPacket(command) {
        let requestPkt = new Packet(true, command, []);
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.SendPacket(requestPkt);
            console.log(requestPkt);
            const MAXREADS = 255;
            let reads = 0;
            let currentByte = yield this.GetOneByte();
            while (currentByte != 0xa5) {
                currentByte = yield this.GetOneByte();
                // When max reads have been reached retry, somthing went wrong
                if (reads++ == MAXREADS) {
                    console.error("Max reads reached");
                    resolve(this.GetPacket(command));
                }
            }
            let receivedCommand = yield this.GetOneByte();
            let dataLenght = yield this.GetOneByte();
            let data = [];
            for (var i = 0; i < dataLenght; i++) {
                data.push(yield this.GetOneByte());
            }
            let checksum = yield this.GetOneByte();
            let pkt = new Packet(false, receivedCommand, data);
            if (!pkt.CheckCheckSum(checksum)) {
                console.error("Checksum failed");
                resolve(this.GetPacket(command));
            }
            resolve(pkt);
        }));
    }
}
