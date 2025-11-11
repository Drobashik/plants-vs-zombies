import { Entity } from "../entities/Entity";
export class Plant extends Entity {
  override readonly type: string = "plant";

  override readonly name: string = "Plant";

  readonly plantType: string = "unknown";

  readonly cost: number = 0;

  readonly reloadSpeed: number = 0;

  protected override _health = 10;

  constructor(public x: number, public y: number) {
    super(x, y);
  }
}
