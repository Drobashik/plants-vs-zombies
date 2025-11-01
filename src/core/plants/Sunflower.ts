import { Plant } from "./Plant";
import sunflowerImage from "../../images/sunflower.webp";
import { Sun } from "./Sun";

export class Sunflower extends Plant {
  name = "sunflower";

  plantType = "generator";

  image = sunflowerImage;

  health = 30;

  reloadSpeed = 20000
  firstReloadSpeed = 6000;

  cost = 50;

  projection: Sun;

  constructor(public x: number, public y: number) {
    super(x, y);

    this.projection = new Sun(x, y);
  }
}
