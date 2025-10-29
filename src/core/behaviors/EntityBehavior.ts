import type { EntityController } from "../engine/EntityController";
import type { Entity } from "../entities/Entity";

export interface EntityBehavior<
  T extends Entity = Entity,
  B extends Entity = Entity
> {
  start(controller: EntityController, entity?: T, parent?: B): void;
}
