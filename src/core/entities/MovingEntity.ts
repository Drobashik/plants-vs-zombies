import { Entity } from "./Entity";

export type MovingEntityAction = "walking" | "paused" | "damaging";

export class MovingEntity extends Entity {
  readonly name: string = "Moving Entity";

  protected override _image = "";
  
  readonly damageSpeed: number = 1000;
  
  speed = 1000; // milliseconds per cell

  override action: MovingEntityAction = "walking";

  constructor(x: number, y: number) {
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
