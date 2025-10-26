import zombieImage from "../../images/zombie.webp";
import { MovingEntity } from "../entities/MovingEntity";

export class Zombie extends MovingEntity {
  name = "Zombie";
  image = zombieImage;

  speed = 7500;

  constructor(public x: number, public y: number) {
    super(x, y);
  }

  makeStep() {
    this.x -= 1;
  }
}
