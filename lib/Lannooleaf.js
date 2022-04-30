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
        return new Promise((reslove) => __awaiter(this, void 0, void 0, function* () {
            yield this.GetData(lannooleafconst.HelloMessage, 10)
                .then(data => { reslove(data.toString()); });
        }));
    }
    GetGraph(graph) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.GetGraphSize()
                .then((size) => __awaiter(this, void 0, void 0, function* () {
                yield this.GetData(lannooleafconst.GetGraphMessage, size)
                    .then(dataBuffer => {
                    console.log(dataBuffer);
                    var i = 0;
                    do {
                        graph.AddNode(dataBuffer[i]);
                        i++;
                    } while (dataBuffer[i] != 0);
                    for (i++; i < dataBuffer.length; i += 3) {
                        graph.AddEdge(dataBuffer[i], dataBuffer[i + 1], dataBuffer[i + 2]);
                    }
                    resolve();
                });
            }));
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
            index += 3;
        });
        return new Promise(reslove => { this.SendAndResolve(SetLedStringMessage, reslove); });
    }
    ClearLed(led) {
        let clearLedMessage = [{
                byteLength: 2,
                sendBuffer: Buffer.from([lannooleafconst.Commands.clearLed, led])
            }];
        return new Promise(reslove => { this.SendAndResolve(clearLedMessage, reslove); });
    }
    ClearAll() {
        return new Promise(resolve => { this.SendAndResolve(lannooleafconst.ClearAllMessage, resolve); });
    }
    GetData(message, numberOfBytes) {
        return new Promise((reslove) => __awaiter(this, void 0, void 0, function* () {
            this.cs.write(0);
            yield this.spi_controller.transfer(message, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error)
                    throw error;
                this.cs.write(1);
                yield this.WaitForDataBegin()
                    .then(() => {
                    let GetData = [{
                            byteLength: numberOfBytes,
                            receiveBuffer: Buffer.alloc(numberOfBytes),
                        }];
                    this.cs.write(0);
                    this.spi_controller.transfer(GetData, (error, message) => {
                        if (error)
                            throw error;
                        this.cs.write(1);
                        reslove(message[0].receiveBuffer);
                    });
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
    GetGraphSize() {
        return new Promise((reslove) => __awaiter(this, void 0, void 0, function* () {
            yield this.GetData(lannooleafconst.GetGraphSizeMessage, 2)
                .then(data => {
                let size = ((data[0] & 0xff) | (data[1] & 0xff));
                reslove(size);
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
    sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
}
