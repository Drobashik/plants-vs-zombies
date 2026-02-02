import { Plant } from "./Plant";
import sunflowerImage from "../../images/sunflower.webp";
import { SunflowerBehavior } from "../behaviors/SunflowerBehavior";

export class Sunflower extends Plant {
  override readonly name: string = "Sunflower";

  override readonly plantType: string = "generator";

  protected override _image = sunflowerImage;

  override readonly reloadSpeed: number = 20000;

  override readonly cost: number = 50;

  override readonly behavior = new SunflowerBehavior();

  readonly firstReloadSpeed = 6000;

  protected override _health = 300;

  override readonly cooldown: number = 8000;

  constructor(x: number, y: number) {
    super(x, y);
  }
}
