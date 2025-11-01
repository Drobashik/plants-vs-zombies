import { Zombie } from "./Zombie";
import bucketHeadZombieImage from "../../images/bucketHeadZombie.webp";
import damagedBucketZombieImage from "../../images/damagedBucket.webp";
import heavilyDamagedBucketZombieImage from "../../images/heavilyDamagedBucket.webp";
import zombieImage from "../../images/zombie.webp";

export class BucketHeadZombie extends Zombie {
  image = bucketHeadZombieImage;

  health = 400;

  minSpawnInterval = 50000;
  maxSpawnInterval = 100000;

  constructor(x: number, y: number) {
    super(x, y);
  }

  takeDamage(damage: number): void {
    super.takeDamage(damage);

    if (this.health < 300) {
      this.image = damagedBucketZombieImage;
    }

    if (this.health < 200) {
      this.image = heavilyDamagedBucketZombieImage;
    }

    if (this.health < 100) {
      this.image = zombieImage;
    }
  }
}
