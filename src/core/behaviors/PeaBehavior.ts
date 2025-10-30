import type { EntityController } from "../engine/EntityController";
import { Pea } from "../plants/Pea";
import type { Plant } from "../plants/Plant";
import { Zombie } from "../zombies/Zombie";
import type { EntityBehavior } from "./EntityBehavior";

export class PeaBehavior implements EntityBehavior {
  protected moveToTarget(
    controller: EntityController,
    pea: Pea,
    plant: Plant
  ): void {
    const { moveLoop, garden } = controller;

    const peaSpeed = pea.speed;

    pea.speed = (pea.speed * 20) / 100;

    moveLoop.setSpeed(pea.speed);

    moveLoop.loop(() => {
      controller.gameLifecycle.onTick();

      const getCellZombie = (x: number, y: number) =>
        garden
          .getCellEntities<Zombie>(x, y)
          .find((entity) => entity.type === "zombie");

      const zombie =
        getCellZombie(pea.x, pea.y) || getCellZombie(pea.x + 1, pea.y);

      if (zombie) {
        controller.startDamaging(pea, zombie);

        controller.hurtEntity(zombie, pea.damageSpeed);

        garden.removeEntity(pea);

        const isZombieDead = zombie.health <= 0;

        if (isZombieDead) {
          garden.removeEntity(zombie);
        }

        return true;
      } else {
        controller.continueWalking(pea);
      }

      const isPeaAtEdge = pea.x === garden.width - 1;

      if (isPeaAtEdge || !plant) {
        garden.removeEntity(pea);

        return true;
      }

      if (!pea.isDamaging) {
        controller.makeOneStep(pea, "right");

        pea.speed = peaSpeed;

        pea.isRecentlyAppeared = false;
      }

      return pea.speed;
    });
  }

  start(controller: EntityController, createdPlant: Plant): void {
    const { spawner, garden, gameLifecycle } = controller;

    spawner.spawnLoop<Pea>(
      Pea,
      (pea) => {
        gameLifecycle.onTick();

        const plant = garden
          .getCellEntities<Plant>(createdPlant.x, createdPlant.y)
          .find((entity) => entity.id === createdPlant.id)!;

        if (!plant) {
          return true;
        }

        const zombieInRow = garden
          .getRowEntitiesFrom(plant.x, plant.y)
          .find((entity) => entity instanceof Zombie);

        if (zombieInRow) {
          pea.isRecentlyAppeared = true;
          garden.placeEntity(pea);
          this.moveToTarget(controller, pea, plant);
        }

        return [plant.damageSpeed, plant.damageSpeed];
      },
      createdPlant.x,
      createdPlant.y
    );
  }
}
