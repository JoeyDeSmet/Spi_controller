type i2c_address = number;
type side = number;

export class Leaf {

  public address: number;
  public adj: Map<side, Leaf>;

  constructor(address: number) {
    this.address = address;
    this.adj = new Map<side, Leaf>();
  }
  
}

export class Graph {

  public map: Map<i2c_address, Leaf>;

  constructor() {
    this.map = new Map<i2c_address, Leaf>();
  }

  AddNode(address: i2c_address) {
    if (!this.map.has(address)) {
      this.map.set(address, new Leaf(address));
    }
  }

  AddEdge(from: i2c_address, from_side: side, to: i2c_address) {
    if (this.map.has(from) && this.map.has(to)) {
      let from_leaf = this.map.get(from);
      let to_leaf   = this.map.get(to);

      from_leaf?.adj.set(from_side, to_leaf!);
    }
  }

  Get(): Leaf {
    if (this.map.has(0xff)) {
      return this.map.get(0xff)!;
    } else {
      return new Leaf(404);
    }
  }

}
