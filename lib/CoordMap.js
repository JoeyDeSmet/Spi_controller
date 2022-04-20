export class Led {
    constructor(address, led) {
        this.address = address;
        this.led = led;
    }
}
export class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    isEqual(cor) {
        return cor.x == this.x && cor.y == this.y;
    }
    Add(cor) {
        this.x += cor.x;
        this.y += cor.y;
    }
}
const sideDistance = [
    new Coordinate(-37, 108),
    new Coordinate(-129, -45),
    new Coordinate(-92, -153),
    new Coordinate(37, -108),
    new Coordinate(129, 45),
    new Coordinate(92, 15),
];
const ledCords = [
    new Coordinate(-20, -11),
    new Coordinate(-43, -20),
    new Coordinate(-67, -40),
    new Coordinate(-79, -58),
    new Coordinate(-37, -57),
    new Coordinate(-19, -52),
    new Coordinate(8, -30),
    new Coordinate(19, -14),
    new Coordinate(20, 17),
    new Coordinate(33, -31),
    new Coordinate(63, 52),
    new Coordinate(48, 63),
    new Coordinate(15, 62),
    new Coordinate(1, 52),
    new Coordinate(-32, 30),
    new Coordinate(-19, 16),
];
export class CoordMap {
    constructor(graph) {
        this.coordMap = new Map();
        var visited = [];
        var vectorMapping = (leaf, originCor) => {
            visited.push(leaf.address);
            console.log("Running on " + leaf.address);
            // Add each led to Map
            ledCords.forEach((cor, index) => {
                let n_cor = cor;
                n_cor.Add(originCor);
                console.log("adding: ");
                console.log(n_cor);
                this.coordMap.set(n_cor, new Led(leaf.address, index));
            });
            leaf.adj.forEach((adjLeaf, side) => {
                if (!visited.includes(adjLeaf.address)) {
                    originCor.Add(sideDistance[side - 1]);
                    vectorMapping(adjLeaf, originCor);
                }
            });
        };
        vectorMapping(graph.Get(), new Coordinate(0, 0));
    }
}
