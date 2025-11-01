import { SunBehavior } from "../behaviors/SunBehavior";
import { Entity } from "../entities/Entity";
import sunImage from "../../images/sun.webp";

export class Sun extends Entity {
  type = "profit";

  profit = 25;

  image = sunImage;

  timeToDisappear = 6000;

  appearTime = 8000;

  isPickable = true;

  speed: number = 6000;

  behavior = new SunBehavior();

  constructor(x: number, y: number) {
    super(x, y);
  }
}
