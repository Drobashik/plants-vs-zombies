import type { EntityController } from "../engine/EntityController";
import { getRandom } from "../engine/Spawner";
import { Sun } from "../plants/Sun";
import type { EntityBehavior } from "./EntityBehavior";

export class SunBehavior implements EntityBehavior {
  static startAmbientSpawn(controller: EntityController) {
    const { spawner, garden, gameLifecycle } = controller;

    spawner.spawnLoop(
      () => new Sun(getRandom(2, garden.width - 2), getRandom(0, 2)),
      (sun) => ({
        type: "delay",
        delays: [{ min: sun.appearTime, max: sun.appearTime }],
        spawn: () => {
          gameLifecycle.onTick();

          const gameState = gameLifecycle.getGameState();

          if (gameState === "lose" || gameState === "win") {
            return "stop";
          }

          sun.isRecentlyAppeared = true;

          sun.behavior.start(controller, sun);

          return "continue";
        },
      })
    );
  }

  start(controller: EntityController, sun: Sun): void {
    const { garden, moveLoop } = controller;

    garden.placeEntity(sun);

    moveLoop.setSpeed(sun.timeToDisappear);

    moveLoop.loop(() => {
      garden.removeEntity(sun);

      return true;
    });
  }
}
