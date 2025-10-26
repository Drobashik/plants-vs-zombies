import { Entity } from "./Entity";

export class Plant extends Entity {
  name = 'Plant'

  constructor(public x: number, public y: number) {
    super(x, y)
  }
}
