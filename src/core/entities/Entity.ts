import type { EntityBehavior } from "../behaviors/EntityBehavior";

export type EntityClass<T> = new (x: number, y: number) => T;

export class Entity {
  id = Date.now();

  type = "unknown";
  name = "entity";
  image = "";

  action = "walking";

  isHurt = false;

  behavior: EntityBehavior;

  isRecentlyAppeared = false;

  isDamaging = false;
  damage = 1;

  health = 0;

  speed = 0;

  constructor(public x: number, public y: number) {}

  takeDamage(damage: number) {
    this.health -= damage;
  }
}
