import { Plant } from "./Plant";
import wallnutImage from "../../images/wallnut.png";
import damagedWallnutImage from "../../images/damagedWallnut.webp";
import heavilydamagedWallnutImage from "../../images/heavilyDamagedWallnut.webp";

export class Wallnut extends Plant {
  override readonly name: string = "Wall-nut";

  readonly plantType: string = "wall";

  protected override _image = wallnutImage;

  readonly cost: number = 50;

  readonly cooldown: number = 30000;

  protected override _health: number = 3000;

  constructor(x: number, y: number) {
    super(x, y);
  }

  takeDamage(damage: number): void {
    super.takeDamage(damage);

    if (this._health < 2000) {
      this._image = damagedWallnutImage;
    }

    if (this._health < 1000) {
      this._image = heavilydamagedWallnutImage;
    }
  }
}
