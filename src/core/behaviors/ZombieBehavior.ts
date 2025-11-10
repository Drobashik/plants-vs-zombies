import type { EntityController } from "../engine/EntityController";
import type { Plant } from "../plants/Plant";
import { Zombie } from "../zombies/Zombie";
import type { EntityBehavior } from "./EntityBehavior";

export class ZombieBehavior implements EntityBehavior {
  private zombieMeetsPlant(controller: EntityController, zombie: Zombie) {
    const { garden } = controller;

    const getPlantCell = (x: number, y: number) =>
      garden
        .getCellEntities<Plant>(x, y)
        .find((entity) => entity.type === "plant");

    const plant =
      getPlantCell(zombie.x + 1, zombie.y) || getPlantCell(zombie.x, zombie.y);

    if (plant) {
      controller.startDamaging(zombie, plant);

      controller.hurtEntity(plant, zombie.damageSpeed / 2);

      const isPlantEntityDead = plant.health <= 0;

      if (isPlantEntityDead) {
        garden.removeEntity(plant);

        const nextPlant = getPlantCell(zombie.x, zombie.y);

        if (!nextPlant) {
          controller.continueWalking(zombie);
        }
      }
    } else {
      controller.continueWalking(zombie);
    }
  }

  start(controller: EntityController, zombie: Zombie): void {
    const { gameLifecycle, moveLoop, garden } = controller;

    garden.placeEntity(zombie);
    gameLifecycle.onTick();

    moveLoop.setSpeed(zombie.speed);

    this.zombieMeetsPlant(controller, zombie);

    moveLoop.loop(() => {
      gameLifecycle.onTick();

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

      this.zombieMeetsPlant(controller, zombie);

      return zombie.isDamaging ? zombie.damageSpeed : zombie.speed;
    });
  }
}
