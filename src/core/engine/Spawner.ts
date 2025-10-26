import type { Entity, EntityClass } from "../entities/Entity";
import { GameLoop } from "./GameLoop";
import type { GardenMap } from "../GardenMap";

export const getRandom = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

export class Spawner {
  spawnerLoop = new GameLoop();

  constructor(
    private garden: GardenMap,
    private minSpawnInterval: number,
    private maxSpawnInterval: number
  ) {}

  spawnEntity<T extends Entity>(EntityInstance: EntityClass<T>) {
    const randomY = getRandom(0, this.garden.height - 1);

    const entity = new EntityInstance(8, randomY);

    this.garden.placeEntity(entity);

    return entity;
  }

  spawnLoop<T extends Entity>(
    EntityInstance: EntityClass<T>,
    startSpanwing: (entity: T) => void
  ) {
    this.spawnerLoop.loop(() => {
      const entity = this.spawnEntity(EntityInstance);

      startSpanwing(entity);

      const spawnInterval = getRandom(
        this.minSpawnInterval,
        this.maxSpawnInterval
      );

      return spawnInterval;
    });
  }
}
