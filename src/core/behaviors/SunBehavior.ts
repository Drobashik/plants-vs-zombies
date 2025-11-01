import type { EntityController } from "../engine/EntityController";
import { Sun } from "../plants/Sun";
import type { Sunflower } from "../plants/Sunflower";
import type { EntityBehavior } from "./EntityBehavior";

export class SunBehavior implements EntityBehavior {
  private disappear(controller: EntityController, sun: Sun) {
    const { moveLoop, garden } = controller;

    moveLoop.setSpeed(sun.timeToDisappear);

    moveLoop.loop(() => {
      garden.removeEntity(sun);
      return true;
    });
  }

  appear(controller: EntityController) {
    const { spawner, garden, gameLifecycle } = controller;

    let firstSpawn = true;

    spawner.spawnLoop(
      Sun,
      { min: 2, max: garden.width - 2 },
      { min: 0, max: 2 },
      (sun) => {
        gameLifecycle.onTick();

        if (firstSpawn) {
          firstSpawn = false;

          return [sun.appearTime, sun.appearTime];
        }

        sun.isRecentlyAppeared = true;

        garden.placeEntity(sun);

        this.disappear(controller, sun);

        return [sun.appearTime, sun.appearTime];
      }
    );
  }

  start(controller: EntityController, createdSunflower: Sunflower): void {
    const { spawner, gameLifecycle, garden } = controller;

    let firstSpawn = true;

    const xPos = createdSunflower.x;
    const yPos = createdSunflower.y;

    spawner.spawnLoop(
      Sun,
      { min: xPos, max: xPos },
      { min: yPos, max: yPos },
      (sun) => {
        gameLifecycle.onTick();

        const sunflower = garden
          .getCellEntities<Sunflower>(xPos, yPos)
          .find((entity) => entity.id === createdSunflower.id)!;

        if (!sunflower) {
          return true;
        }

        if (firstSpawn) {
          firstSpawn = false;

          return [sunflower.firstReloadSpeed, sunflower.firstReloadSpeed];
        }

        garden.placeEntity(sun);

        this.disappear(controller, sun);

        return [sunflower.reloadSpeed, sunflower.reloadSpeed];
      }
    );
  }
}
