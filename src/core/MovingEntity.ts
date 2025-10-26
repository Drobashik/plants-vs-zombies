import { Entity } from "./Entity";

export class MovingEntity extends Entity {
  name = "Entity name";
  image = "";

  speed = 1000;

  constructor(public x: number, public y: number) {
    super(x, y);
  }

  makeStep(direction?: "left" | "right") {
    if (direction === "right") {
      this.x += 1;
    } else {
      this.x -= 1;
    }

    return this.x;
  }
}
