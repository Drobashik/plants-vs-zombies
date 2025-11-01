import { Entity } from "../entities/Entity";
export class Plant extends Entity {
  name = "plant";

  type = "plant";

  plantType = "unknown";

  health = 10;

  speed = 1000;

  cost = 0;

  reloadSpeed = 0;

  projection: Entity;

  constructor(public x: number, public y: number) {
    super(x, y);
  }
}
