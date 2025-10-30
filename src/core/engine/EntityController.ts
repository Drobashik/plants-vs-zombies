import { GameLoop } from "./GameLoop";
import type { GardenMap } from "../GardenMap";
import type { Spawner } from "./Spawner";
import { Zombie } from "../zombies/Zombie";
import type { Plant } from "../plants/Plant";
import type { Entity, EntityClass } from "../entities/Entity";
import type { MovingEntity } from "../entities/MovingEntity";

export type GameLyfecycle = {
  onGameOver: (outcome: "win" | "lose") => void;
  onTick: () => void;
};

export class EntityController<
  T extends Entity = Entity,
  B extends Entity = Entity
> {
  moveLoop = new GameLoop();

  constructor(
    public garden: GardenMap,
    public spawner: Spawner,
    public gameLifecycle: GameLyfecycle
  ) {}

  triggerGameOver(outcome: "win" | "lose") {
    this.moveLoop.stopAll();
    this.spawner.spawnerLoop.stopAll();

    this.gameLifecycle.onGameOver(outcome);
  }

  hurtEntity(entity: B, hurtTime = 50) {
    entity.isHurt = true;

    setTimeout(() => {
      entity.isHurt = false;
    }, hurtTime);
  }

  makeOneStep<T extends MovingEntity>(
    entity: T,
    direction: "left" | "right" = "left"
  ) {
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

  startPlantActions<P extends Plant>(plant: P) {
    if (plant?.behavior) plant.behavior.start(this);

    if (plant.projection?.behavior)
      plant.projection.behavior.start(this, plant.projection, plant);
  }

  startZombieActions<T extends Zombie>(Zombies: EntityClass<T>[]) {
    Zombies.forEach((Zombie, index) => {
      let isFirstSkipped = index === 0;

      this.spawner.spawnLoop<Zombie>(Zombie, (zombie) => {
        if (!isFirstSkipped) {
          isFirstSkipped = true;

          return [zombie.minSpawnInterval, zombie.maxSpawnInterval];
        }

        this.gameLifecycle.onTick();
        this.garden.placeEntity(zombie);
        zombie.behavior.start(this, zombie);

        return [zombie.minSpawnInterval, zombie.maxSpawnInterval];
      });
    });
  }
}
