import { Entity } from "../entities/Entity";
// TODO: create PlantHandler
export class Plant extends Entity {
  name = "plant";

  type = "plant";

  plantType = "unknown";

  health = 10;

  damageSpeed = 0;

  constructor(public x: number, public y: number) {
    super(x, y);
  }
}
