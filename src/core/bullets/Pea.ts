import { MovingEntity } from "../entities/MovingEntity";
import peaImage from "../../images/pea.webp";
import { PeaBehavior } from "../behaviors/PeaBehavior";
import type { Plant } from "../plants/Plant";

export class Pea extends MovingEntity {
  protected override _image = peaImage;

  override readonly type: string = "bullet";

  override speed = 350;

  override damage = 20;
  
  override readonly damageSpeed: number = 50;
  
  protected override _health = 1;
  
  readonly behavior = new PeaBehavior();

  constructor(x: number, y: number, private _parentPlant?: Plant) {
    super(x, y);
  }

  get parentPlant() {
    return this._parentPlant;
  }
}
