import { Entity } from "../entities/Entity";
import type { MovingEntity } from "../entities/MovingEntity";
// TODO: create PlantHandler
export class Plant extends Entity {
  name = "plant";

  type = "plant";

  plantType = "unknown";

  health = 10;

  damageSpeed = 0;

  projection: MovingEntity;

  constructor(public x: number, public y: number) {
    super(x, y);
  }
}
