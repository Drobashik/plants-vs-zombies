import { SunBehavior } from "../behaviors/SunBehavior";
import { Entity } from "../entities/Entity";
import sunImage from "../../images/sun.webp";
import type { Plant } from "./Plant";

export class Sun extends Entity {
  override readonly type: string = "profit";

  override readonly name: string = "Sun";

  protected override _image = sunImage;

  readonly profit = 25;

  readonly timeToDisappear = 6000;

  readonly appearTime = 8000;

  readonly isPickable = true;

  readonly behavior = new SunBehavior();

  constructor(x: number, y: number, private _parentPlant?: Plant) {
    super(x, y);
  }

  get parentPlant() {
    return this._parentPlant;
  }
}
