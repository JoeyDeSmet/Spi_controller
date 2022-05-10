export class Packet {

  private read: number;
  private command: number;
  public data: Array<number>;

  constructor(read: Boolean, command: number, data: Array<number>) {
    this.read    = read ? 0x5a : 0xa5;
    this.command = command;
    this.data    = data;
  }

  ToBuffer(): Buffer {
    let data = [this.read, this.command, this.data.length];
    for (var byte of this.data) data.push(byte);
    data.push(this.Checksum());

    return Buffer.from(data);
  }

  Size(): number {
    return this.data.length + 4;
  }

  CheckCheckSum(received: number): Boolean {
    return received == this.Checksum();
  }

  private Checksum(): number {
    let sum = 0;
    for (var byte of this.data) sum += byte;
    return sum & 0xff;
  }

}