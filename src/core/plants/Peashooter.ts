import { Plant } from "./Plant";
import peashooterImage from "../../images/peashooter.webp";
import { Pea } from "./Pea";

export class Peashooter extends Plant {
  name = "peashooter";

  image = peashooterImage;

  plantType = "shooter";

  health = 50;

  damageSpeed = 3000;

  projection: Pea;

  constructor(public x: number, public y: number) {
    super(x, y);

    this.projection = new Pea(x, y);
  }
}
