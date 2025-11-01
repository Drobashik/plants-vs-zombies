import type { EntityController } from "../engine/EntityController";
import type { Plant } from "../plants/Plant";
import { Zombie } from "../zombies/Zombie";
import type { EntityBehavior } from "./EntityBehavior";

export class ZombieBehavior implements EntityBehavior {
  private controller: EntityController;

  private zombieMeetsPlant(zombie: Zombie) {
    const getPlantCell = (x: number, y: number) =>
      this.controller.garden
        .getCellEntities<Plant>(x, y)
        .find((entity) => entity.type === "plant");

    const plant =
      getPlantCell(zombie.x, zombie.y) || getPlantCell(zombie.x + 1, zombie.y);

    if (plant) {
      this.controller.startDamaging(zombie, plant);

      this.controller.hurtEntity(plant, zombie.damageSpeed / 2);

      const isPlantEntityDead = plant.health <= 0;

      if (isPlantEntityDead) {
        this.controller.garden.removeEntity(plant);

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
