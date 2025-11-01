import type { EntityController } from "../engine/EntityController";
import { Pea } from "../bullets/Pea";
import type { Plant } from "../plants/Plant";
import { Zombie } from "../zombies/Zombie";
import type { EntityBehavior } from "./EntityBehavior";
import type { Peashooter } from "../plants/Peashooter";

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

  start(controller: EntityController, createdPeashooter: Peashooter): void {
    const { spawner, garden, gameLifecycle } = controller;

    const xPos = createdPeashooter.x;
    const yPos = createdPeashooter.y;

    spawner.spawnLoop<Pea>(
      Pea,
      { min: xPos, max: xPos },
      { min: yPos, max: yPos },
      (pea) => {
        gameLifecycle.onTick();

        const peashooter = garden
          .getCellEntities<Peashooter>(createdPeashooter.x, createdPeashooter.y)
          .find((entity) => entity.id === createdPeashooter.id)!;

        if (!peashooter) {
          return true;
        }

        const zombieInRow = garden
          .getRowEntitiesFrom(peashooter.x, peashooter.y)
          .find((entity) => entity instanceof Zombie);

        if (zombieInRow) {
          pea.isRecentlyAppeared = true;
          garden.placeEntity(pea);
          this.moveToTarget(controller, pea, peashooter);
        }

        return [peashooter.reloadSpeed, peashooter.reloadSpeed];
      }
    );
  }
}
