export type EntityClass<T> = new (x: number, y: number) => T;

export class Entity {
  id = Date.now();

  type = "unknown";
  name = "entity";
  image = "";

  action = "paused";

  health = 0;

  speed = 0;

  constructor(public x: number, public y: number) {}

  takeDamage(damage: number) {
    this.health -= damage;
  }
}
