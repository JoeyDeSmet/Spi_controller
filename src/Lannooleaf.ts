import spi from 'spi-device';
import { Gpio } from 'onoff';

import * as lannooleafconst from './LannooleafConsts.js';
import { Color } from './Color.js';
import { ColorString } from './Color.js';
import { Graph } from './Graph.js';

export class Lannooleaf {

  private spi_controller: any;
  private cs: Gpio;

  constructor () {
    this.cs = new Gpio(25, 'out');
    this.spi_controller = null;
  }

  Init(): Promise<void> {
    return new Promise(resolve => {
      this.spi_controller = spi.open(0, 0, error => {
        if (error) throw error;
        
        this.spi_controller.setOptions({
          mode: 3,
          maxSpeedHz: 1000000,
          noChipSelect: true
        },
        error => { if (error) throw error; resolve(); });
      });
    });
  }

  Destroy(): Promise<void> {
    return new Promise(reslove => {
      this.cs.unexport();
      this.spi_controller.close(error => { 
        if (error) throw error; 
        reslove(); 
      });
    });
  }

  Wake(): Promise<void> {
    return new Promise(resolve => {
      this.cs.write(0).then(() => {
        this.cs.write(1).then(() => {
          resolve();
        });
      })
    });
  }

  HelloMessage(): Promise<string> {
    return new Promise(async reslove => {
      await this.GetData(lannooleafconst.HelloMeassage, 10)
      .then(data => { reslove(data.toString()); });
    });
  }

  GetAdjList(): Promise<Graph> {
    return new Promise(async reslove => {
      let graph: Graph = new Graph();
      let size: number = 0;

      await this.GetAdjListSize().then(data => {
        size = data;
      });

      await this.GetData(lannooleafconst.GetAdjList, size)
      .then(data => {
        let i: number = 0;

        while (data[i] != 0) {
          graph.AddNode(data[i]);
          i++;
        }

        for (i++; i < data.length; i+=3) {
          graph.AddEdge(data[i], data[i + 1], data[i + 2]);
        }
      })
      .finally(() => { reslove(graph); });
    });
  }

  SetLed(address: number, led: number, color: Color): Promise<void> {
    let SetLedMessage: spi.SpiMessage = [{
      byteLength: 6,
      sendBuffer: Buffer.from([lannooleafconst.Commands.setLed, address, led, color.red, color.green, color.blue])
    }];

    return new Promise(resolve => { this.SendAndResolve(SetLedMessage, resolve); });
  }

  SetAll(color: Color): Promise<void> {
    let SetAllMessage: spi.SpiMessage = [{
      byteLength: 4,
      sendBuffer: Buffer.from([lannooleafconst.Commands.setAllLeds, color.red, color.green, color.blue])
    }];

    return new Promise(resolve => { this.SendAndResolve(SetAllMessage, resolve); });
  }

  SetLedString(address: number, ledstring: ColorString): Promise<void> {
    let SetLedStringMessage: spi.SpiMessage = [{
      byteLength: 50,
      sendBuffer: Buffer.alloc(50)
    }];

    if (ledstring.length > 16) throw new Error("Ledstring can only be of size 16 or less");

    let sendBuffer = SetLedStringMessage[0].sendBuffer;
    sendBuffer![0] = lannooleafconst.Commands.setLedString;
    sendBuffer![1] = address;

    var index = 2;
    ledstring.forEach(color => {
      sendBuffer![index    ] = color.red;
      sendBuffer![index + 1] = color.green;
      sendBuffer![index + 2] = color.blue;
    });

    return new Promise(reslove => { this.SendAndResolve(SetLedStringMessage, reslove); });
  }

  private GetData(message: spi.SpiMessage, numberOfBytes: number): Promise<Buffer> {
    return new Promise(async reslove => {
      this.spi_controller.transfer(message, async error => {
        if (error) throw error;
      
        await this.WaitForDataBegin();
        let GetData: spi.SpiMessage = [{
          byteLength: numberOfBytes,
          receiveBuffer: Buffer.alloc(numberOfBytes)
        }];

        this.spi_controller.transfer(GetData, (error, message) => {
          if (error) throw error;
          reslove(message![0].receiveBuffer!);
        });
      });
    });
  }

  private SendAndResolve(message: spi.SpiMessage, resolve_callback: any): void {
    this.cs.write(0);
    this.spi_controller.transfer(message, (error, message) => {
      if (error) throw error;
      this.cs.write(1);
      resolve_callback();
    });
  }

  private GetAdjListSize(): Promise<number> {
    return new Promise(async reslove => { 
      await this.GetData(lannooleafconst.GetAdjListSize, 2).then(data => {
        let count = ((data[0] & 0xff) | (data[1] & 0xff));
        reslove(count);
      });
    });
  }

  private GetOneByte(): Promise<number> {
    return new Promise(async resolve => {
      this.cs.write(0);
      
      this.spi_controller.transfer(lannooleafconst.GetOneByteMessage, (error, message) => {
        if (error) throw error;
        this.cs.write(1);
        resolve(message![0].receiveBuffer![0]);
      });
    });
  }

  private WaitForDataBegin(): Promise<void> {
    return new Promise(async resolve => {
      let byte: number;
      byte = 1;

      while (byte != 0x00) {
        await this.GetOneByte().then(received_byte => {
          byte = received_byte;
        });
      };

      resolve();
    });
  }

}
