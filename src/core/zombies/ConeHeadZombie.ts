import { Zombie } from "./Zombie";
import coneHeadZombieImage from "../../images/coneHeadZombie.webp";
import damagedConeImage from "../../images/damagedCone.webp";
import heavilyDamagedConeImage from "../../images/heavilyDamagedCone.webp";
import zombieImage from "../../images/zombie.webp";

export class ConeHeadZombie extends Zombie {
  image = coneHeadZombieImage;

  health = 200;

  minSpawnInterval = 25000;
  maxSpawnInterval = 100000;

  constructor(x: number, y: number) {
    super(x, y);
  }

  takeDamage(damage: number): void {
    super.takeDamage(damage);

    if (this.health < 160) {
      this.image = damagedConeImage;
    }

    if (this.health < 130) {
      this.image = heavilyDamagedConeImage;
    }

    if (this.health < 100) {
      this.image = zombieImage;
    }
  }
}
