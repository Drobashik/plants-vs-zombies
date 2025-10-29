import type { GameController } from "../engine/GameController";
import type { Plant } from "../plants/Plant";
import { Zombie } from "../zombies/Zombie";
import type { EntityBehavior } from "./EntityBehavior";

export class ZombieBehavior implements EntityBehavior {
  start(controller: GameController, zombie: Zombie): void {
    const {
      moveLoop,
      garden,
      makeOneStep,
      startDamaging,
      continueWalking,
      render,
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
