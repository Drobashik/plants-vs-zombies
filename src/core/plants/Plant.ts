import { Entity } from "../entities/Entity";

export class Plant extends Entity {
  name = "plant";

  type = "plant";

  health = 10;

  constructor(public x: number, public y: number) {
    super(x, y);
  }
}
