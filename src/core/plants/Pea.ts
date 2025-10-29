import {
  MovingEntity,
  type MovingEntityAction,
} from "../entities/MovingEntity";
import peaImage from "../../images/pea.webp";
import { PeaBehavior } from "../behaviors/PeaBehavior";

export class Pea extends MovingEntity {
  speed = 350;

  image = peaImage;

  type = "bullet";

  damage = 30;

  damageSpeed = 50;

  health = 1;

  action: MovingEntityAction = "walking";

  behavior = new PeaBehavior();

  constructor(x: number, y: number) {
    super(x, y);
  }
}
