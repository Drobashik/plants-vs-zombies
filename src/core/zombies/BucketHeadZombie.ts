import { Zombie } from "./Zombie";
import bucketHeadZombieImage from "../../images/bucketHeadZombie.webp";

export class BucketHeadZombie extends Zombie {
  image = bucketHeadZombieImage;

  health = 400;

  minSpawnInterval = 30000;
  maxSpawnInterval = 50000;

  constructor(x: number, y: number) {
    super(x, y);
  }

  takeDamage(damage: number): void {
    super.takeDamage(damage);
  }
}
