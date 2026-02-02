import type { EntityController } from "../engine/EntityController";
import { Sun } from "../plants/Sun";
import { Random } from "../utils/Random";
import type { EntityBehavior } from "./EntityBehavior";

export class SunBehavior implements EntityBehavior {
  private static appearTime: number = 4000;
  private static maxAppearTime = 10000;

  static startAmbientSpawn(controller: EntityController) {
    const { spawner, garden, gameLifecycle } = controller;

    SunBehavior.appearTime = 4000;

    const random = new Random();

    spawner.spawnLoop(
      () => new Sun(random.next(2, garden.width - 2), random.next(0, 2)),
      (sun) => ({
        type: "delay",
        delaying: () => {
          SunBehavior.appearTime *= 1.02;

          const time = Math.min(
            SunBehavior.appearTime,
            SunBehavior.maxAppearTime
          );

          return [{ min: time, max: time }];
        },

        spawn: () => {
          gameLifecycle.onTick();

          const { isGameEnd } = gameLifecycle.onGameState();

          if (isGameEnd) {
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
