import { Plant } from "./Plant";
import peashooterImage from "../../images/peashooter.webp";

export class Peashooter extends Plant {
  static registryName = 'peashooter'

  name = "Peashooter";

  image = peashooterImage;

  speed = 0;

  constructor(public x: number, public y: number) {
    super(x, y);
  }
}
