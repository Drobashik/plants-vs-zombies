import type { EntityController } from "../engine/EntityController";
import { Sun } from "../plants/Sun";
import type { Sunflower } from "../plants/Sunflower";
import type { EntityBehavior } from "./EntityBehavior";

export class SunBehavior implements EntityBehavior {
  start(controller: EntityController, createdSunflower: Sunflower): void {
    const { spawner, gameLifecycle, garden } = controller;

    let firstSpawn = true;

    spawner.spawnLoop(
      Sun,
      (sun) => {
        gameLifecycle.onTick();

        const sunflower = garden
          .getCellEntities<Sunflower>(createdSunflower.x, createdSunflower.y)
          .find((entity) => entity.id === createdSunflower.id)!;

        if (!sunflower) {
          return true;
        }

        if (firstSpawn) {
          firstSpawn = false;

          return [sunflower.reloadSpeed, sunflower.reloadSpeed];
        }

        garden.placeEntity(sun);

        return [sunflower.reloadSpeed, sunflower.reloadSpeed];
      },
      createdSunflower.x,
      createdSunflower.y
    );
  }
}
