import { SunBehavior } from "../behaviors/SunBehavior";
import { Entity } from "../entities/Entity";
import sunImage from "../../images/sun.webp";
import type { Plant } from "./Plant";

export class Sun extends Entity {
  type = "profit";

  name = "Sun";

  profit = 25;

  image = sunImage;

  timeToDisappear = 6000;

  appearTime = 8000;

  isPickable = true;

  speed: number = 6000;

  readonly behavior = new SunBehavior();

  constructor(x: number, y: number, private _parentPlant?: Plant) {
    super(x, y);
  }

  get parentPlant() {
    return this._parentPlant;
  }
}
