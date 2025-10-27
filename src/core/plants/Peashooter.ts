import { Plant } from "./Plant";
import peashooterImage from "../../images/peashooter.webp";

export class Peashooter extends Plant {
  name = "peashooter";

  image = peashooterImage;

  plantType = "shooter";

  health = 50;

  damageSpeed = 3000;

  constructor(public x: number, public y: number) {
    super(x, y);
  }
}
