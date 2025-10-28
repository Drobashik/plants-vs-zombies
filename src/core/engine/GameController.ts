import { GameLoop } from "./GameLoop";
import type { GardenMap } from "../GardenMap";
import type { Spawner } from "./Spawner";
import { Zombie } from "../zombies/Zombie";
import type { Plant } from "../plants/Plant";
import type { MovingEntity } from "../entities/MovingEntity";
import type { Entity, EntityClass } from "../entities/Entity";

export class GameController<
  T extends MovingEntity = MovingEntity,
  B extends Entity = Entity
> {
  render: () => void;
  moveLoop = new GameLoop();

  constructor(public garden: GardenMap, public spawner: Spawner) {}

  makeOneStep(entity: T, direction: "left" | "right" = "left") {
    this.garden.removeEntity(entity);
    entity.makeStep(direction);
    this.garden.placeEntity(entity);
  }

  startDamaging(damagingEntity: T, vulnerableEntity: B) {
    damagingEntity.action = "damaging";
    damagingEntity.isDamaging = true;

    vulnerableEntity.takeDamage(damagingEntity.damage);
  }

  continueWalking(entity: T) {
    entity.action = "walking";
    entity.isDamaging = false;
  }

  setRenderFn(renderFn: () => void) {
    this.render = renderFn;
  }

  startPlantActions<P extends Plant>(plant: P) {
    if (plant?.behavior) plant.behavior.start(this);

    if (plant.projection?.behavior)
      plant.projection.behavior.start(this, plant.projection, plant);
  }

  startZombieActions<T extends Zombie>(Zombies: EntityClass<T>[]) {
    const zombies = this.garden.getEntities(Zombies);

    for (const zombie of zombies) {
      zombie.behavior.start(this, zombie);
    }

    Zombies.forEach((Zombie, index) => {
      let isFirstSkipped = index === 0;

      this.spawner.spawnLoop<Zombie>(Zombie, (zombie) => {
        if (!isFirstSkipped) {
          isFirstSkipped = true;

          return [zombie.minSpawnInterval, zombie.maxSpawnInterval];
        }

        this.render();
        this.garden.placeEntity(zombie);
        zombie.behavior.start(this, zombie);

        return [zombie.minSpawnInterval, zombie.maxSpawnInterval];
      });
    });
  }
}
