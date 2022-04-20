import spi from 'spi-device';
import { Gpio } from 'onoff';

import * as lannooleafconst from './LannooleafConsts.js';
import { Color } from './Color.js';
import { ColorString } from './Color.js';
import { Graph } from './Graph.js';
import { buffer } from 'stream/consumers';

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
      await this.GetData(lannooleafconst.HelloMessage, 10)
      .then(data => { reslove(data.toString()); });
    });
  }

  GetGraph(graph: Graph): Promise<void> {
    return new Promise(async resolve => {
      let message: spi.SpiMessage = [{
        byteLength: 1,
        sendBuffer: Buffer.from([0x02])
      }];

      this.spi_controller.transfer(message, async error => {
        if (error) throw error;

        let byte: number = 1;

        while (byte != 0x00) {
          await new Promise<void>(res => {
            let getByte: spi.SpiMessage = [{
              byteLength: 1,
              receiveBuffer: Buffer.alloc(1)
            }];

            this.spi_controller.transfer(getByte, (error, response) => {
              if (error) throw error;

              byte = response[0].receiveBuffer[0];
              res();
            });
          })
        }

        let getSize: spi.SpiMessage = [{
          byteLength: 2,
          receiveBuffer: Buffer.alloc(2)
        }];

        this.spi_controller.transfer(getSize, (error, response) => {
          if (error) throw error;
          let size = (response[0].receiveBuffer[0] & 0xff) | (response[0].receiveBuffer[1] & 0xff);

          let getGraph: spi.SpiMessage = [{
            byteLength: 1,
            sendBuffer: Buffer.from([0x03])
          }];

          this.spi_controller.transfer(getGraph, (error) => {
           if (error) throw error;
            
            let getData: spi.SpiMessage = [{
              byteLength: size,
              receiveBuffer: Buffer.alloc(size)
            }];
  
            this.spi_controller.transfer(getData, (error, response) => {
              if (error) throw error;
              let dataBuffer = response[0].receiveBuffer;
  
              console.log(dataBuffer);
              if (size == 1) {
                  // No leafs connected only controller
                  graph.AddNode(dataBuffer[0]);
                } else {
                  let i: number = 0;
      
                  do {
                    graph.AddNode(dataBuffer[i]);
                    i++;
                  } while (dataBuffer[i] != 0x00);
                  
                  i++;
      
                  for (i; i < dataBuffer.length; i += 3) {
                    graph.AddEdge(dataBuffer[i    ],
                                  dataBuffer[i + 1],
                                  dataBuffer[i + 3]);
                  };
                }
  
              resolve();
            });
          })

        });
      });
      // await this.GetGraphSize()
      // .then(async size => {
      //   console.log(size);
      //   await this.GetData(lannooleafconst.GetGraphMessage, size)
      //   .then(dataBuffer => {
          
      //     if (size == 1) {
      //       // No leafs connected only controller
      //       graph.AddNode(dataBuffer[0]);
      //     } else {
      //       let i: number = 0;

      //       do {
      //         graph.AddNode(dataBuffer[i]);
      //         i++;
      //       } while (dataBuffer[i] != 0x00);
            
      //       i++;

      //       for (i; i < dataBuffer.length; i += 3) {
      //         graph.AddEdge(dataBuffer[i    ],
      //                       dataBuffer[i + 1],
      //                       dataBuffer[i + 3]);
      //       };
      //     }

      //     resolve();
      //   });
      // });
    
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

  ClearLed(led: number): Promise<void> {
    let clearLedMessage: spi.SpiMessage = [{
      byteLength: 2,
      sendBuffer: Buffer.from([lannooleafconst.Commands.clearLed, led])
    }];

    return new Promise(reslove => { this.SendAndResolve(clearLedMessage, reslove); });
  }

  ClearAll(): Promise<void> {
    return new Promise(resolve => { this.SendAndResolve(lannooleafconst.ClearAllMessage, resolve); });
  }

  private GetData(message: spi.SpiMessage, numberOfBytes: number): Promise<Buffer> {
    return new Promise(async reslove => {
      await this.spi_controller.transfer(message, async (error, message) => {
        if (error) throw error;
        await this.WaitForDataBegin()
        .then(() => {
          let GetData: spi.SpiMessage = [{
            byteLength: numberOfBytes,
            receiveBuffer: Buffer.alloc(numberOfBytes),
          }];
  
          this.cs.write(0);
          this.spi_controller.transfer(GetData, (error, message) => {
            if (error) throw error;
            this.cs.write(1);
            reslove(message![0].receiveBuffer!);
          });
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

  private GetGraphSize(): Promise<number> {
    return new Promise(async reslove => { 
      await this.GetData(lannooleafconst.GetGraphSizeMessage, 2)
      .then(data => {
        let size = ((data[0] & 0xff) | (data[1] & 0xff));
        reslove(size);
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
