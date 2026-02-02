import { Plant } from "./Plant";
import peashooterImage from "../../images/peashooter.png";
import { PeashooterBehavior } from "../behaviors/PeashooterBehavior";

export class Peashooter extends Plant {
  override readonly name: string = "Peashooter";

  protected override _image = peashooterImage;

  override readonly plantType: string = "shooter";

  override readonly cost: number = 100;

  override readonly reloadSpeed: number = 2000;

  override readonly behavior = new PeashooterBehavior();

  override readonly cooldown: number = 6000;

  protected override _health = 300;

  constructor(x: number, y: number) {
    super(x, y);
  }
}
