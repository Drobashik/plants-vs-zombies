import { Plant } from "./Plant";
import sunflowerImage from "../../images/sunflower.webp";
import { Sun } from "./Sun";
import { SunflowerBehavior } from "../behaviors/SunflowerBehavior";

export class Sunflower extends Plant {
  name = "Sunflower";

  plantType = "generator";

  image = sunflowerImage;

  health = 30;

  reloadSpeed = 20000;
  firstReloadSpeed = 6000;

  cost = 50;

  projection: Sun;

  readonly behavior = new SunflowerBehavior();

  constructor(public x: number, public y: number) {
    super(x, y);

    this.projection = new Sun(x, y, this);
  }
}
