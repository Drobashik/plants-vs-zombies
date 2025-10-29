import type { EntityController } from "../engine/EntityController";
import type { Plant } from "../plants/Plant";
import { Zombie } from "../zombies/Zombie";
import type { EntityBehavior } from "./EntityBehavior";

export class ZombieBehavior implements EntityBehavior {
  start(controller: EntityController, zombie: Zombie): void {
    const {
      moveLoop,
      garden,
      makeOneStep,
      startDamaging,
      continueWalking,
      render,
      hurtEntity,
    } = controller;

    moveLoop.setSpeed(zombie.speed);

    moveLoop.loop(() => {
      render();

      const isZombieAtEdge = zombie.x === 0;
      const isZombieDead = zombie.health <= 0;

      if ((isZombieAtEdge && !zombie.isDamaging) || isZombieDead) {
        garden.removeEntity(zombie);

        return true;
      }

      if (!zombie.isDamaging) {
        makeOneStep.call(controller, zombie);
      }

      const plantEntity = garden
        .getCellEntities<Plant>(zombie.x, zombie.y)
        .find((entity) => entity.type === "plant");

      if (plantEntity) {
        startDamaging(zombie, plantEntity);

        hurtEntity(plantEntity, zombie.damageSpeed / 2);

        const isPlantEntityDead = plantEntity.health <= 0;

        if (isPlantEntityDead) {
          garden.removeEntity(plantEntity);

          continueWalking(zombie);
        }
      } else {
        continueWalking(zombie);
      }

      return zombie.isDamaging ? zombie.damageSpeed : zombie.speed;
    });
  }
}
