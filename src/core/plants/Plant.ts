import { Entity } from "../entities/Entity";

export class Plant extends Entity {
  static registryName = "plant";

  name = "Plant";

  constructor(public x: number, public y: number) {
    super(x, y);
  }
}
