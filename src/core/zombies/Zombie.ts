import zombieImage from "../../images/zombie.webp";
import { ZombieBehavior } from "../behaviors/ZombieBehavior";
import withoutHandZombieImage from "../../images/withoutHandZombie.webp";
import { MovingEntity } from "../entities/MovingEntity";

export class Zombie extends MovingEntity {
  override readonly type: string = "zombie";

  override readonly name: string = "Zombie";

  protected override _image = zombieImage;

  readonly behavior = new ZombieBehavior();

  override damageSpeed: number = 500;

  override speed = 7500;

  override damage = 20;

  protected override _health = 200;

  constructor(public x: number, public y: number) {
    super(x, y);
  }

  makeStep() {
    this.x -= 1;
  }

  protected makeZombieWithoutHand() {
    if (this.health < 50) {
      this._image = withoutHandZombieImage;
    }
  }

  takeDamage(damage: number): void {
    super.takeDamage(damage);

    this.makeZombieWithoutHand();
  }
}
