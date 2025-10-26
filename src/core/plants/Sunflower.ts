import { Plant } from "./Plant";
import sunflowerImage from "../../images/sunflower.webp";

export class Sunflower extends Plant {
  name = "sunflower";

  image = sunflowerImage;

  health = 30

  constructor(public x: number, public y: number) {
    super(x, y);
  }
}
