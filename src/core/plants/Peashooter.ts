import { Plant } from "./Plant";
import peashooterImage from "../../images/peashooter.webp";

export class Peashooter extends Plant {
  name = "peashooter";

  image = peashooterImage;

  health = 50

  constructor(public x: number, public y: number) {
    super(x, y);
  }
}
