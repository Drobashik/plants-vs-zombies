import type { EntityBehavior } from "../behaviors/EntityBehavior";

export type EntityClass<T> = new (x: number, y: number) => T;

export class Entity {
  readonly id = self.crypto.randomUUID();

  readonly type: string = "unknown";

  readonly name: string = "Entity";

  protected _image = "";

  readonly profit: number = 0;

  readonly behavior: EntityBehavior;

  readonly isPickable: boolean = false;

  action = "walking";

  isHurt = false;

  isRecentlyAppeared = false;

  isDamaging = false;

  isPlacedOnMap = false;

  damage = 1;

  protected _health = 0;

  constructor(public x: number, public y: number) {}

  get image() {
    return this._image;
  }

  get health() {
    return this._health;
  }

  takeDamage(damage: number) {
    this._health -= damage;
  }
}
