export class Color {
  public red:   number;
  public green: number;
  public blue:  number;

  constructor(red: number, green: number, blue: number) {
    this.red = (red <= 0) ? 1 : red;
    this.green = (green <= 0) ? 1 : green;
    this.blue = (blue <= 0) ? 1 : blue;

    this.red = (this.red >= 255) ? 255 : this.red;
    this.green = (this.green >= 255) ? 255 : this.green;
    this.blue = (this.blue >= 255) ? 255 : this.blue;
  }
}

export type ColorString = Array<Color>;