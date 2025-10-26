import type { Entity } from "../entities/Entity";
import { GameLoop } from "./GameLoop";
import type { GardenMap } from "../GardenMap";

export const getRandom = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

export class Spawner {
  constructor(
    private garden: GardenMap,
    private minSpawnInterval: number,
    private maxSpawnInterval: number,
    public spawnerLoop: GameLoop
  ) {}

  spawnEntity<T extends Entity>(
    EntityInstance: new (x: number, y: number) => T
  ) {
    const randomY = getRandom(0, 4);

    const entity = new EntityInstance(8, randomY);

    if (!this.garden.cells[entity.y][entity.x].entity) {
      this.garden.placeEntity(entity);
    }

    return entity;
  }

  spawnLoop<T extends Entity>(
    EntityInstance: new (x: number, y: number) => T,
    startSpanwing: (entity: T) => void
  ) {
    this.spawnerLoop.loop(() => {
      const entity = this.spawnEntity(EntityInstance);

      startSpanwing(entity);

      this.spawnerLoop.setSpeed(
        getRandom(this.minSpawnInterval, this.maxSpawnInterval)
      );

      return false;
    });
  }
}
