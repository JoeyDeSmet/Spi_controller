import spi from 'spi-device';
import { Gpio } from 'onoff';

import * as lannooleafconst from './LannooleafConsts.js';
import { Color } from './Color.js';
import { ColorString } from './Color.js';
import { Graph } from './Graph.js';
import { Packet } from './Packet.js';

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
          maxSpeedHz: 2000000,
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
    return new Promise(async resolve => {
      let pkt = this.GetPacket(lannooleafconst.Commands.helloMessage);
      resolve(String.fromCharCode(...(await pkt).data));
    });
  }

  GetGraph(): Promise<Graph> {
    return new Promise(async resolve => {
      let graph: Graph = new Graph();

      let pkt = await this.GetPacket(lannooleafconst.Commands.getAdjList);
      let index = 0;

      while (pkt.data[index] != 0x00) {
        graph.AddNode(pkt.data[index]);
        index++;
      }

      index++;

      for (index; index < pkt.data.length; index+=3) {
        graph.AddEdge(pkt.data[index], pkt.data[index + 1], pkt.data[index + 2]);
      }

      resolve(graph);
    });
  }

  SetLed(address: number, led: number, color: Color): Promise<void> {
    let pkt: Packet = new Packet(false, lannooleafconst.Commands.setLed, [
      address,
      led,
      color.red,
      color.green,
      color.blue
    ]);

    return new Promise(async resolve => { 
      await this.SendPacket(pkt);
      resolve();
    });
  }

  SetAll(color: Color): Promise<void> {
    let pkt: Packet = new Packet(false, lannooleafconst.Commands.setAllLeds, [
      color.red,
      color.green,
      color.blue
    ]);

    return new Promise(async resolve => { 
      await this.SendPacket(pkt); 
      resolve();
    });
  }

  SetLedString(address: number, ledstring: ColorString): Promise<void> {
    if (ledstring.length > 16) throw new Error("Ledstring can only be of size 16 or less");

    let data = [address];
    for (var color of ledstring) {
      data.push(color.red);
      data.push(color.green);
      data.push(color.blue);
    }

    let pkt: Packet = new Packet(false, lannooleafconst.Commands.setLedString, data);

    return new Promise(async resolve => { 
      await this.SendPacket(pkt);
      resolve();
    });
  }

  ClearLed(address: number ,led: number): Promise<void> {
    let pkt: Packet = new Packet(false, lannooleafconst.Commands.clearLed, [
      address,
      led
    ]);

    return new Promise(async resolve => { 
      await this.SendPacket(pkt);
      resolve();
    });
  }

  ClearAll(): Promise<void> {
    let pkt: Packet = new Packet(false, lannooleafconst.Commands.clearAll, []);

    return new Promise(async resolve => { 
      await this.SendPacket(pkt);
      resolve();
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

  private SendPacket(pkt: Packet): Promise<void> {
    let message: spi.SpiMessage = [{
      byteLength:    pkt.Size(),
      sendBuffer:    pkt.ToBuffer()
    }];

    return new Promise(resolve => {

      this.cs.writeSync(0);
      this.spi_controller.transfer(message, (error, message) => {
        if (error) throw error;
        this.cs.writeSync(1);

        resolve();
      });
    });
  }

  private GetPacket(command: number): Promise<Packet> {
    let requestPkt: Packet = new Packet(true, command, []);

    return new Promise(async resolve => {

      await this.SendPacket(requestPkt);

      console.log(requestPkt);

      const MAXREADS = 255;

      let reads = 0;
      let currentByte = await this.GetOneByte();

      while (currentByte != 0xa5) {
        currentByte = await this.GetOneByte();
        
        // When max reads have been reached retry, somthing went wrong
        if (reads++ == MAXREADS) {
          console.error("Max reads reached");
          resolve(this.GetPacket(command));
        } 
      }

      let receivedCommand = await this.GetOneByte();
      let dataLenght      = await this.GetOneByte();
      let data            = [];

      for (var i = 0; i < dataLenght; i++) {
        data.push(await this.GetOneByte());
      }

      let checksum = await this.GetOneByte();

      let pkt: Packet = new Packet(false, receivedCommand, data);

      if (!pkt.CheckCheckSum(checksum)) {
        console.error("Checksum failed");
        resolve(this.GetPacket(command));
      } 

      resolve(pkt);
    });
  }
}
