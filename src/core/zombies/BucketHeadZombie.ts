import { Zombie } from "./Zombie";
import bucketHeadZombieImage from "../../images/bucketHeadZombie.webp";
import zombieImage from "../../images/zombie.webp";

export class BucketHeadZombie extends Zombie {
  image = bucketHeadZombieImage;

  health = 500;

  minSpawnInterval = 15000;
  maxSpawnInterval = 100000;

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
