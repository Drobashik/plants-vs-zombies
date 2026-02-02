import type { EntityController } from "../engine/EntityController";
import { Pea } from "../bullets/Pea";
import { Zombie } from "../zombies/Zombie";
import type { EntityBehavior } from "./EntityBehavior";

export class PeaBehavior implements EntityBehavior {
  start(controller: EntityController, pea: Pea) {
    const { moveLoop, garden, gameLifecycle } = controller;

    pea.isRecentlyAppeared = true;

    garden.placeEntity(pea);

    const peaSpeed = pea.speed;

    pea.speed = (pea.speed * 20) / 100;

    moveLoop.setSpeed(pea.speed);

    moveLoop.loop(() => {
      gameLifecycle.onTick();

      const getCellZombie = (x: number, y: number) =>
        garden
          .getCellEntities<Zombie>(x, y)
          .find((entity) => entity.type === "zombie");

      const zombie =
        getCellZombie(pea.x, pea.y) || getCellZombie(pea.x + 1, pea.y);

      if (zombie) {
        controller.startDamaging(pea, zombie);

        controller.hurtEntity(zombie);

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

      if (isPeaAtEdge) {
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
}
