import {
  MovingEntity,
  type MovingEntityAction,
} from "../entities/MovingEntity";
import peaImage from "../../images/pea.webp";

export class Pea extends MovingEntity {
  speed = 350;

  image = peaImage;

  type = "bullet";

  damage = 30;

  health = 1;

  action: MovingEntityAction = "walking";

  constructor(x: number, y: number) {
    super(x, y);
  }
}
