"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var spi = __importStar(require("spi-device"));
var onoff_1 = require("onoff");
var lannooleafconst = __importStar(require("./LannooleafConsts"));
var Graph_1 = __importDefault(require("./Graph"));
var Lannooleaf = /** @class */ (function () {
    function Lannooleaf() {
        this.cs = new onoff_1.Gpio(25, 'out');
        this.spi_controller = new spi.SpiDevice();
    }
    Lannooleaf.prototype.Init = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.spi_controller = spi.open(0, 0, function (error) {
                if (error)
                    throw error;
                _this.spi_controller.setOptions({
                    mode: 3,
                    maxSpeedHz: 1000000,
                    noChipSelect: true
                }, function (error) { if (error)
                    throw error; resolve(); });
            });
        });
    };
    Lannooleaf.prototype.Destroy = function () {
        var _this = this;
        return new Promise(function (reslove) {
            _this.cs.unexport();
            _this.spi_controller.close(function (error) {
                if (error)
                    throw error;
                reslove();
            });
        });
    };
    Lannooleaf.prototype.HelloMessage = function () {
        var _this = this;
        return new Promise(function (reslove) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.GetData(lannooleafconst.HelloMeassage, 10)
                            .then(function (data) { reslove(data.toString()); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Lannooleaf.prototype.GetAdjList = function () {
        var _this = this;
        return new Promise(function (reslove) { return __awaiter(_this, void 0, void 0, function () {
            var graph, size;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        graph = new Graph_1.default();
                        size = 0;
                        return [4 /*yield*/, this.GetAdjListSize().then(function (data) {
                                size = data;
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.GetData(lannooleafconst.GetAdjList, size)
                                .then(function (data) {
                                var i = 0;
                                while (data[i] != 0) {
                                    graph.AddNode(data[i]);
                                    i++;
                                }
                                for (i++; i < data.length; i += 3) {
                                    graph.AddEdge(data[i], data[i + 1], data[i + 2]);
                                }
                            })
                                .finally(function () { reslove(graph); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Lannooleaf.prototype.SetLed = function (address, led, color) {
        var _this = this;
        var SetLedMessage = [{
                byteLength: 6,
                sendBuffer: Buffer.from([lannooleafconst.Commands.setLed, address, led, color.red, color.green, color.blue])
            }];
        return new Promise(function (resolve) { _this.SendAndResolve(SetLedMessage, resolve); });
    };
    Lannooleaf.prototype.SetAll = function (color) {
        var _this = this;
        var SetAllMessage = [{
                byteLength: 4,
                sendBuffer: Buffer.from([lannooleafconst.Commands.setAllLeds, color.red, color.green, color.blue])
            }];
        return new Promise(function (resolve) { _this.SendAndResolve(SetAllMessage, resolve); });
    };
    Lannooleaf.prototype.SetLedString = function (address, ledstring) {
        var _this = this;
        var SetLedStringMessage = [{
                byteLength: 50,
                sendBuffer: Buffer.alloc(50)
            }];
        if (ledstring.length > 16)
            throw new Error("Ledstring can only be of size 16 or less");
        var sendBuffer = SetLedStringMessage[0].sendBuffer;
        sendBuffer[0] = lannooleafconst.Commands.setLedString;
        sendBuffer[1] = address;
        var index = 2;
        ledstring.forEach(function (color) {
            sendBuffer[index] = color.red;
            sendBuffer[index + 1] = color.green;
            sendBuffer[index + 2] = color.blue;
        });
        return new Promise(function (reslove) { _this.SendAndResolve(SetLedStringMessage, reslove); });
    };
    Lannooleaf.prototype.GetData = function (message, numberOfBytes) {
        var _this = this;
        return new Promise(function (reslove) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.spi_controller.transfer(message, function (error) { return __awaiter(_this, void 0, void 0, function () {
                    var GetData;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (error)
                                    throw error;
                                return [4 /*yield*/, this.WaitForDataBegin()];
                            case 1:
                                _a.sent();
                                GetData = [{
                                        byteLength: numberOfBytes,
                                        receiveBuffer: Buffer.alloc(numberOfBytes)
                                    }];
                                this.spi_controller.transfer(GetData, function (error, message) {
                                    if (error)
                                        throw error;
                                    reslove(message[0].receiveBuffer);
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
    };
    Lannooleaf.prototype.SendAndResolve = function (message, resolve_callback) {
        var _this = this;
        this.cs.write(0);
        this.spi_controller.transfer(message, function (error, message) {
            if (error)
                throw error;
            _this.cs.write(1);
            resolve_callback();
        });
    };
    Lannooleaf.prototype.GetAdjListSize = function () {
        var _this = this;
        return new Promise(function (reslove) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.GetData(lannooleafconst.GetAdjListSize, 2).then(function (data) {
                            var count = ((data[0] & 0xff) | (data[1] & 0xff));
                            reslove(count);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Lannooleaf.prototype.GetOneByte = function () {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.cs.write(0);
                this.spi_controller.transfer(lannooleafconst.GetOneByteMessage, function (error, message) {
                    if (error)
                        throw error;
                    _this.cs.write(1);
                    resolve(message[0].receiveBuffer[0]);
                });
                return [2 /*return*/];
            });
        }); });
    };
    Lannooleaf.prototype.WaitForDataBegin = function () {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var byte;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        byte = 1;
                        _a.label = 1;
                    case 1:
                        if (!(byte != 0x00)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.GetOneByte().then(function (received_byte) {
                                byte = received_byte;
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        ;
                        resolve();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return Lannooleaf;
}());
exports.default = Lannooleaf;
