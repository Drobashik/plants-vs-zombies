import { SunBehavior } from "../behaviors/SunBehavior";
import { Entity } from "../entities/Entity";
import sunImage from "../../images/sun.webp";

export class Sun extends Entity {
  type = "profit";

  image = sunImage;

  behavior = new SunBehavior();

  constructor(x: number, y: number) {
    super(x, y);
  }
}
