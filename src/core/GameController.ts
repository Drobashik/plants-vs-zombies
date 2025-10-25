import type { GameLoop } from "./GameLoop";
import type { GardenMap } from "./GardenMap";
import type { MovingEntity } from "./MovingEntity";
import type { Spawner } from "./Spawner";
import { Zombie } from "./Zombie";

export class GameController {
  private render: () => void;

  constructor(
    private garden: GardenMap,
    private spawner: Spawner,
    private moveLoop: GameLoop
  ) {}

  private startEntityMove<T extends MovingEntity>(entity: T) {
    this.moveLoop.setSpeed(entity.speed);

    this.moveLoop.loop(() => {
      this.render();
      this.garden.removeEntity(entity);
      entity.makeStep();
      this.garden.placeEntity(entity);

      if (entity.x < 0) {
        this.garden.removeEntity(entity);
      }

      return entity.x < 0;
    });
  }

  bootstrapGame(render: () => void) {
    this.render = render;

    const zombies = this.garden.getEntities(Zombie);

    for (const zombie of zombies) {
      this.startEntityMove(zombie);
    }

    this.spawner.spawnLoop<Zombie>(Zombie, (zombie) => {
      this.render();

      this.startEntityMove(zombie);
    });
  }
}
