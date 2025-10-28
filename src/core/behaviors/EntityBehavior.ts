import type { GameController } from "../engine/GameController";
import type { Entity } from "../entities/Entity";

export interface EntityBehavior<
  T extends Entity = Entity,
  B extends Entity = Entity
> {
  start(controller: GameController, entity?: T, parent?: B): void;
}
