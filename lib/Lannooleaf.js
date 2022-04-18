var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as spi from 'spi-device';
import { Gpio } from 'onoff';
import * as lannooleafconst from './LannooleafConsts.js';
import Graph from './Graph.js';
export default class Lannooleaf {
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
                    maxSpeedHz: 1000000,
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
    HelloMessage() {
        return new Promise((reslove) => __awaiter(this, void 0, void 0, function* () {
            yield this.GetData(lannooleafconst.HelloMeassage, 10)
                .then(data => { reslove(data.toString()); });
        }));
    }
    GetAdjList() {
        return new Promise((reslove) => __awaiter(this, void 0, void 0, function* () {
            let graph = new Graph();
            let size = 0;
            yield this.GetAdjListSize().then(data => {
                size = data;
            });
            yield this.GetData(lannooleafconst.GetAdjList, size)
                .then(data => {
                let i = 0;
                while (data[i] != 0) {
                    graph.AddNode(data[i]);
                    i++;
                }
                for (i++; i < data.length; i += 3) {
                    graph.AddEdge(data[i], data[i + 1], data[i + 2]);
                }
            })
                .finally(() => { reslove(graph); });
        }));
    }
    SetLed(address, led, color) {
        let SetLedMessage = [{
                byteLength: 6,
                sendBuffer: Buffer.from([lannooleafconst.Commands.setLed, address, led, color.red, color.green, color.blue])
            }];
        return new Promise(resolve => { this.SendAndResolve(SetLedMessage, resolve); });
    }
    SetAll(color) {
        let SetAllMessage = [{
                byteLength: 4,
                sendBuffer: Buffer.from([lannooleafconst.Commands.setAllLeds, color.red, color.green, color.blue])
            }];
        return new Promise(resolve => { this.SendAndResolve(SetAllMessage, resolve); });
    }
    SetLedString(address, ledstring) {
        let SetLedStringMessage = [{
                byteLength: 50,
                sendBuffer: Buffer.alloc(50)
            }];
        if (ledstring.length > 16)
            throw new Error("Ledstring can only be of size 16 or less");
        let sendBuffer = SetLedStringMessage[0].sendBuffer;
        sendBuffer[0] = lannooleafconst.Commands.setLedString;
        sendBuffer[1] = address;
        var index = 2;
        ledstring.forEach(color => {
            sendBuffer[index] = color.red;
            sendBuffer[index + 1] = color.green;
            sendBuffer[index + 2] = color.blue;
        });
        return new Promise(reslove => { this.SendAndResolve(SetLedStringMessage, reslove); });
    }
    GetData(message, numberOfBytes) {
        return new Promise((reslove) => __awaiter(this, void 0, void 0, function* () {
            this.spi_controller.transfer(message, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error)
                    throw error;
                yield this.WaitForDataBegin();
                let GetData = [{
                        byteLength: numberOfBytes,
                        receiveBuffer: Buffer.alloc(numberOfBytes)
                    }];
                this.spi_controller.transfer(GetData, (error, message) => {
                    if (error)
                        throw error;
                    reslove(message[0].receiveBuffer);
                });
            }));
        }));
    }
    SendAndResolve(message, resolve_callback) {
        this.cs.write(0);
        this.spi_controller.transfer(message, (error, message) => {
            if (error)
                throw error;
            this.cs.write(1);
            resolve_callback();
        });
    }
    GetAdjListSize() {
        return new Promise((reslove) => __awaiter(this, void 0, void 0, function* () {
            yield this.GetData(lannooleafconst.GetAdjListSize, 2).then(data => {
                let count = ((data[0] & 0xff) | (data[1] & 0xff));
                reslove(count);
            });
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
    WaitForDataBegin() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let byte;
            byte = 1;
            while (byte != 0x00) {
                yield this.GetOneByte().then(received_byte => {
                    byte = received_byte;
                });
            }
            ;
            resolve();
        }));
    }
}