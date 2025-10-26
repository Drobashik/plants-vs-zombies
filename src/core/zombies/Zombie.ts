import zombieImage from "../../images/zombie.webp";
import { MovingEntity } from "../entities/MovingEntity";

export class Zombie extends MovingEntity {
  type = "zombie";

  name = "zombie";
  image = zombieImage;

  speed = 5000;

  damage = 10;

  constructor(public x: number, public y: number) {
    super(x, y);
  }

  makeStep() {
    this.x -= 1;
  }
}
