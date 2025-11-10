import zombieImage from "../../images/zombie.webp";
import { ZombieBehavior } from "../behaviors/ZombieBehavior";
import withoutHandZombieImage from "../../images/withoutHandZombie.webp";
import { MovingEntity } from "../entities/MovingEntity";

export class Zombie extends MovingEntity {
  readonly type = "zombie";

  name = "Zombie";

  image = zombieImage;

  speed = 7500;

  damage = 10;

  health = 100;

  readonly behavior = new ZombieBehavior();

  constructor(public x: number, public y: number) {
    super(x, y);
  }

  makeStep() {
    this.x -= 1;
  }

  protected makeZombieWithoutHand() {
    if (this.health < 50) {
      this.image = withoutHandZombieImage;
    }
  }

  takeDamage(damage: number): void {
    super.takeDamage(damage);

    this.makeZombieWithoutHand();
  }
}
