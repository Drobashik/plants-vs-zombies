import type { EntityController } from "../engine/EntityController";
import { Sun } from "../plants/Sun";
import type { Sunflower } from "../plants/Sunflower";
import type { EntityBehavior } from "./EntityBehavior";

export class SunflowerBehavior implements EntityBehavior {
  start(controller: EntityController, sunflower: Sunflower) {
    const { spawner, gameLifecycle } = controller;
    const { x, y, reloadSpeed, firstReloadSpeed } = sunflower;

    spawner.spawnLoop(
      () => new Sun(x, y),
      (sun) => ({
        type: "delay",
        delaying: () => [
          {
            min: firstReloadSpeed,
            max: firstReloadSpeed,
          },
          {
            min: reloadSpeed,
            max: reloadSpeed,
          },
        ],
        spawn: () => {
          gameLifecycle.onTick();

          const { isGameEnd } = gameLifecycle.onGameState();

          if (!sunflower.isPlacedOnMap || isGameEnd) {
            return "stop";
          }

          sun.behavior.start(controller, sun);

          return "continue";
        },
      })
    );
  }
}
