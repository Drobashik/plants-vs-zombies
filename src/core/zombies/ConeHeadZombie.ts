import { Zombie } from "./Zombie";
import coneHeadZombieImage from "../../images/coneHeadZombie.webp";
import zombieImage from "../../images/zombie.webp";

export class ConeHeadZombie extends Zombie {
  image = coneHeadZombieImage;

  health = 250;

  minSpawnInterval = 15000;
  maxSpawnInterval = 30000;

  constructor(x: number, y: number) {
    super(x, y);
  }

  takeDamage(damage: number): void {
    super.takeDamage(damage);

    if (this.health < 100) {
      this.image = zombieImage;
    }
  }
}
