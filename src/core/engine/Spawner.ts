import type { Entity, EntityClass } from "../entities/Entity";
import { GameLoop } from "./GameLoop";
import type { GardenMap } from "../GardenMap";

export const getRandom = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

export class Spawner {
  spawnerLoop = new GameLoop();

  constructor(private garden: GardenMap) {}

  private spawnEntityRandomly<T extends Entity>(
    EntityInstance: EntityClass<T>
  ) {
    const randomY = getRandom(0, this.garden.height - 1);

    const entity = new EntityInstance(8, randomY);

    return entity;
  }

  private spawnEntity<T extends Entity>(
    x: number,
    y: number,
    EntityInstance: EntityClass<T>
  ) {
    const entity = new EntityInstance(x, y);

    return entity;
  }

  spawnLoop<T extends Entity>(
    EntityInstance: EntityClass<T>,
    startSpanwing: (entity: T) => [number, number] | true,
    x?: number,
    y?: number
  ) {
    this.spawnerLoop.loop(() => {
      const entity =
        x !== undefined && y !== undefined
          ? this.spawnEntity(x, y, EntityInstance)
          : this.spawnEntityRandomly(EntityInstance);

      if (!entity) return true;

      const loopData = startSpanwing(entity);

      if (!Array.isArray(loopData)) {
        return loopData;
      }

      const [minSpawnInterval, maxSpawnInterval] = loopData;

      const spawnInterval = getRandom(minSpawnInterval, maxSpawnInterval);

      return spawnInterval;
    });
  }
}
