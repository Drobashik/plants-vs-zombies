import { Plant } from "./Plant";
import peashooterImage from "../../images/peashooter.webp";
import { Pea } from "../bullets/Pea";
import { PeashooterBehavior } from "../behaviors/PeashooterBehavior";

export class Peashooter extends Plant {
  name = "Peashooter";

  image = peashooterImage;

  plantType = "shooter";

  health = 50;

  cost = 100;

  reloadSpeed = 2000;

  projection: Pea;

  readonly behavior = new PeashooterBehavior();

  constructor(public x: number, public y: number) {
    super(x, y);

    this.projection = new Pea(x, y, this);
  }
}
