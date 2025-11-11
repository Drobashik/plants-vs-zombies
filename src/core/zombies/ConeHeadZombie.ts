import { Zombie } from "./Zombie";
import coneHeadZombieImage from "../../images/coneHeadZombie.webp";
import damagedConeImage from "../../images/damagedCone.webp";
import heavilyDamagedConeImage from "../../images/heavilyDamagedCone.webp";
import zombieImage from "../../images/zombie.webp";

export class ConeHeadZombie extends Zombie {
  override readonly name: string = "Cone Head Zombie";

  protected override _image = coneHeadZombieImage;

  protected override _health = 200;

  constructor(x: number, y: number) {
    super(x, y);
  }

  takeDamage(damage: number): void {
    super.takeDamage(damage);

    if (this.health < 160) {
      this._image = damagedConeImage;
    }

    if (this.health < 130) {
      this._image = heavilyDamagedConeImage;
    }

    if (this.health < 100) {
      this._image = zombieImage;
    }

    super.makeZombieWithoutHand();
  }
}
