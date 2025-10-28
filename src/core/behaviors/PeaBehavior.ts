import type { GameController } from "../engine/GameController";
import { Pea } from "../plants/Pea";
import type { Plant } from "../plants/Plant";
import { Zombie } from "../zombies/Zombie";
import type { EntityBehavior } from "./EntityBehavior";

export class PeaBehavior implements EntityBehavior {
  private moveToTarget(controller: GameController, pea: Pea, plant: Plant): void {
    const {
      moveLoop,
      render,
      garden,
      startDamaging,
      continueWalking,
      makeOneStep,
    } = controller;

    moveLoop.setSpeed(0);

    moveLoop.loop(() => {
      render();

      const isPeaAtEdge = pea.x === garden.width - 1;

      if (isPeaAtEdge || !plant) {
        garden.removeEntity(pea);

        return true;
      }

      const getCellZombie = (x: number, y: number) =>
        garden
          .getCellEntities<Zombie>(x, y)
          .find((entity) => entity.type === "zombie");

      const zombie =
        getCellZombie(pea.x, pea.y) || getCellZombie(pea.x + 1, pea.y);

      if (zombie) {
        startDamaging.call(controller, pea, zombie);

        garden.removeEntity(pea);

        const isZombieDead = zombie.health <= 0;

        if (isZombieDead) {
          garden.removeEntity(zombie);
        }

        return true;
      } else {
        continueWalking.call(controller, pea);
      }

      if (!pea.isDamaging) {
        makeOneStep.call(controller, pea, "right");
      }

      return pea.speed;
    });
  }

  start(controller: GameController, createdPlant: Plant): void {
    const { spawner, render, garden } = controller;

    spawner.spawnLoop<Pea>(
      Pea,
      (pea) => {
        render();

        const plant = garden
          .getCellEntities<Plant>(createdPlant.x, createdPlant.y)
          .find((entity) => entity.id === createdPlant.id)!;

        const zombieInRow = garden
          .getRowEntitiesFrom(plant.x, plant.y)
          .find((entity) => entity instanceof Zombie);

        if (!plant) {
          return true;
        }

        if (zombieInRow) {
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
