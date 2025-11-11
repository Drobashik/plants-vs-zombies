import { Pea } from "../bullets/Pea";
import type { EntityController } from "../engine/EntityController";
import type { Peashooter } from "../plants/Peashooter";
import { Zombie } from "../zombies/Zombie";
import type { EntityBehavior } from "./EntityBehavior";

export class PeashooterBehavior implements EntityBehavior {
  start(controller: EntityController, peashooter: Peashooter) {
    const { spawner, garden, gameLifecycle } = controller;
    const { x, y, reloadSpeed } = peashooter;

    spawner.spawnLoop<Pea>(
      () => new Pea(x, y),
      (pea) => ({
        type: "instant",
        delays: [{ min: reloadSpeed, max: reloadSpeed }],
        spawn: () => {
          gameLifecycle.onTick();

          if (!peashooter.isPlacedOnMap) {
            return "stop";
          }

          const zombieInRow = garden
            .getRowEntitiesFrom(peashooter.x, peashooter.y)
            .find((entity) => entity instanceof Zombie);

          if (zombieInRow) {
            pea.behavior.start(controller, pea);
          }

          return "continue";
        },
      })
    );
  }
}
