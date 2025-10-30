import type { EntityController } from "../engine/EntityController";
import type { Plant } from "../plants/Plant";
import { Zombie } from "../zombies/Zombie";
import type { EntityBehavior } from "./EntityBehavior";

export class ZombieBehavior implements EntityBehavior {
  private controller: EntityController;

  private zombieMeetsPlant(zombie: Zombie) {
    const plantEntity = this.controller.garden
      .getCellEntities<Plant>(zombie.x, zombie.y)
      .find((entity) => entity.type === "plant");

    if (plantEntity) {
      this.controller.startDamaging(zombie, plantEntity);

      this.controller.hurtEntity(plantEntity, zombie.damageSpeed / 2);

      const isPlantEntityDead = plantEntity.health <= 0;

      if (isPlantEntityDead) {
        this.controller.garden.removeEntity(plantEntity);

        this.controller.continueWalking(zombie);
      }
    } else {
      this.controller.continueWalking(zombie);
    }
  }

  start(controller: EntityController, zombie: Zombie): void {
    const { moveLoop, garden } = controller;
    this.controller = controller;

    moveLoop.setSpeed(zombie.speed);

    this.zombieMeetsPlant(zombie);

    moveLoop.loop(() => {
      controller.gameLifecycle.onTick();

      const isZombieDead = zombie.health <= 0;

      if (isZombieDead) {
        garden.removeEntity(zombie);

        return true;
      }

      const isZombieAtEdge = zombie.x === 0;

      if (isZombieAtEdge && !zombie.isDamaging) {
        controller.triggerGameOver("lose");

        return true;
      }

      if (!zombie.isDamaging) {
        controller.makeOneStep(zombie);
      }

      this.zombieMeetsPlant(zombie);

      return zombie.isDamaging ? zombie.damageSpeed : zombie.speed;
    });
  }
}
