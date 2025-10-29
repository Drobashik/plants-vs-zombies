import zombieImage from "../../images/zombie.webp";
import { ZombieBehavior } from "../behaviors/ZombieBehavior";
import { MovingEntity } from "../entities/MovingEntity";

export class Zombie extends MovingEntity {
  type = "zombie";

  name = "zombie";
  image = zombieImage;

  speed = 5000;

  damage = 10;

  health = 100;

  minSpawnInterval = 7500;
  maxSpawnInterval = 15000;

  behavior = new ZombieBehavior();

  constructor(public x: number, public y: number) {
    super(x, y);
  }

  makeStep() {
    this.x -= 1;
  }
}
