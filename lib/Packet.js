export class Packet {
    constructor(read, command, data) {
        this.read = read ? 0x5a : 0xa5;
        this.command = command;
        this.data = data;
    }
    ToBuffer() {
        let data = [this.read, this.command, this.data.length];
        for (var byte of this.data)
            data.push(byte);
        data.push(this.Checksum());
        return Buffer.from(data);
    }
    Size() {
        return this.data.length + 4;
    }
    CheckCheckSum(received) {
        return received == this.Checksum();
    }
    Checksum() {
        let sum = 0;
        for (var byte of this.data)
            sum += byte;
        return sum & 0xff;
    }
}
