import type { Entity, EntityClass } from "../entities/Entity";
import { GameLoop } from "./GameLoop";

export type RandomPosition = {
  min: number;
  max: number;
}

export const getRandom = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

export class Spawner {
  spawnerLoop = new GameLoop();

  constructor() {}

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
    randomX: RandomPosition,
    randomY: RandomPosition,
    startSpanwing: (entity: T) => [number, number] | true,
  ) {
    return this.spawnerLoop.loop(() => {
      const x = getRandom(randomX.min, randomX.max);
      const y = getRandom(randomY.min, randomY.max);

      const entity = this.spawnEntity(x, y, EntityInstance);

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
