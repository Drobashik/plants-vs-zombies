import { Plant } from "./Plant";
import sunflowerImage from "../../images/sunflower.webp";

export class Sunflower extends Plant {
  static registryName = "sunflower";

  name = "Sunflower";

  image = sunflowerImage;

  speed = 0;

  constructor(public x: number, public y: number) {
    super(x, y);
  }
}
