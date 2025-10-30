import { Plant } from "./Plant";
import peashooterImage from "../../images/peashooter.webp";
import { Pea } from "../bullets/Pea";

export class Peashooter extends Plant {
  name = "peashooter";

  image = peashooterImage;

  plantType = "shooter";

  health = 50;

  cost = 100;

  reloadSpeed = 3000;

  projection: Pea;

  constructor(public x: number, public y: number) {
    super(x, y);

    this.projection = new Pea(x, y);
  }
}
