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
  private _moveLoop: GameLoop;
  private _spawner: Spawner;

  constructor(
    private _garden: GardenMap,
    private _gameLifecycle: GameLyfecycle
  ) {
    this._moveLoop = new GameLoop();
    this._spawner = new Spawner();
  }

  get moveLoop() {
    return this._moveLoop;
  }

  get spawner() {
    return this._spawner;
  }

  get garden() {
    return this._garden;
  }

  get gameLifecycle() {
    return this._gameLifecycle;
  }

  triggerGameOver(outcome: GameOutcome) {
    this._gameLifecycle.onGameOver(outcome);
  }

  hurtEntity(entity: Entity, hurtTime = 50) {
    entity.isHurt = true;

    setTimeout(() => {
      entity.isHurt = false;
    }, hurtTime);
  }

  makeOneStep(entity: MovingEntity, direction: Direction = "left") {
    this._garden.removeEntity(entity);
    entity.makeStep(direction);
    this._garden.placeEntity(entity);
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
