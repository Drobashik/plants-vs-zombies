import { Entity } from "./Entity";

export type MovingEntityAction = "walking" | "paused" | "damaging";

export class MovingEntity extends Entity {
  name = "Entity name";
  image = "";

  speed = 1000; // seconds per cell
  damageSpeed = 1000;

  action: MovingEntityAction = "walking";

  constructor(public x: number, public y: number) {
    super(x, y);
  }

  makeStep(direction?: "left" | "right") {
    if (direction === "right") {
      this.x += 1;
    } else {
      this.x -= 1;
    }
  }
}
