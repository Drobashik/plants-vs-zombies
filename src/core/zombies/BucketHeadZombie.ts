import { Zombie } from "./Zombie";
import bucketHeadZombieImage from "../../images/bucketHeadZombie.webp";
import damagedBucketZombieImage from "../../images/damagedBucket.webp";
import heavilyDamagedBucketZombieImage from "../../images/heavilyDamagedBucket.webp";
import zombieImage from "../../images/zombie.webp";

export class BucketHeadZombie extends Zombie {
  override readonly name: string = "Bucket Head Zombie";

  protected override _image = bucketHeadZombieImage;

  protected override _health = 1100;

  constructor(x: number, y: number) {
    super(x, y);
  }

  takeDamage(damage: number) {
    super.takeDamage(damage);

    if (this.health < 800) {
      this._image = damagedBucketZombieImage;
    }

    if (this.health < 500) {
      this._image = heavilyDamagedBucketZombieImage;
    }

    if (this.health < 200) {
      this._image = zombieImage;
    }

    super.makeZombieWithoutHand();
  }
}
