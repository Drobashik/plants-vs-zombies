import { GameLoop } from "./GameLoop";
import type { GardenMap } from "../GardenMap";
import { Spawner } from "./Spawner";
import type { Entity } from "../entities/Entity";
import type { MovingEntity } from "../entities/MovingEntity";
import type { GameState } from "../GameManager";

type GameOutcome = "win" | "lose";

type Direction = "left" | "right";

export type GameLyfecycle = {
  getGameState: () => GameState;
  onGameOver: (outcome: GameOutcome) => void;
  onTick: () => void;
};

export class EntityController {
  moveLoop: GameLoop;
  spawner: Spawner;

  constructor(
    public garden: GardenMap,
    public gameLifecycle: GameLyfecycle
  ) {
    this.moveLoop = new GameLoop();
    this.spawner = new Spawner();
  }

  triggerGameOver(outcome: GameOutcome) {
    this.gameLifecycle.onGameOver(outcome);
  }

  hurtEntity(entity: Entity, hurtTime = 50) {
    entity.isHurt = true;

    setTimeout(() => {
      entity.isHurt = false;
    }, hurtTime);
  }

  makeOneStep(entity: MovingEntity, direction: Direction = "left") {
    this.garden.removeEntity(entity);
    entity.makeStep(direction);
    this.garden.placeEntity(entity);
  }

  startDamaging(damagingEntity: Entity, victim: Entity) {
    damagingEntity.action = "damaging";
    damagingEntity.isDamaging = true;

    victim.takeDamage(damagingEntity.damage);
  }

  continueWalking(entity: Entity) {
    entity.action = "walking";
    entity.isDamaging = false;
  }
}
