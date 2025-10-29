import { Zombie } from "./Zombie";
import coneHeadZombieImage from "../../images/coneHeadZombie.webp";

export class ConeHeadZombie extends Zombie {
  image = coneHeadZombieImage;

  health = 200;

  minSpawnInterval = 15000;
  maxSpawnInterval = 30000;

  constructor(x: number, y: number) {
    super(x, y);
  }
}
