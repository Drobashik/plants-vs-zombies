import zombieImage from "../../images/zombie.webp";
import { ZombieBehavior } from "../behaviors/ZombieBehavior";
import withoutHandZombieImage from "../../images/withoutHandZombie.webp";
import { MovingEntity } from "../entities/MovingEntity";

export class Zombie extends MovingEntity {
  type = "zombie";

  name = "zombie";
  image = zombieImage;

  speed = 6000;

  damage = 10;

  health = 100;

  minSpawnInterval = 3000;
  maxSpawnInterval = 50000;

  behavior = new ZombieBehavior();

  constructor(public x: number, public y: number) {
    super(x, y);
  }

  changeZombieDifficulty(difficulty: number) {
    this.maxSpawnInterval = Math.max(
      this.minSpawnInterval,
      this.maxSpawnInterval - difficulty
    );
  }

  makeStep() {
    this.x -= 1;
  }

  takeDamage(damage: number): void {
    super.takeDamage(damage);

    if (this.health < 50) {
      this.image = withoutHandZombieImage;
    }
  }
}
