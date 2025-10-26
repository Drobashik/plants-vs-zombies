import { GameLoop } from "./GameLoop";
import type { GardenMap } from "../GardenMap";
import type { MovingEntity } from "../entities/MovingEntity";
import type { Spawner } from "./Spawner";
import { Zombie } from "../zombies/Zombie";

export class GameController {
  private render: () => void;
  public moveLoop = new GameLoop();

  constructor(private garden: GardenMap, private spawner: Spawner) {}

  private startEntityMove<T extends MovingEntity>(entity: T) {
    this.moveLoop.setSpeed(entity.speed);

    this.moveLoop.loop(() => {
      this.render();

      const isEntityAtEdge = entity.x === 0;

      if (isEntityAtEdge && !entity.isDamaging) {
        this.garden.removeEntity(entity);

        return true;
      }

      if (!entity.isDamaging) {
        this.garden.removeEntity(entity);
        entity.makeStep();
        this.garden.placeEntity(entity);
      }

      const plantEntity = this.garden
        .getCellEntities(entity.x, entity.y)
        .find((entity) => entity.type === "plant");

      if (plantEntity) {
        entity.action = 'damaging';
        entity.isDamaging = true;

        plantEntity.takeDamage(entity.damage);

        const isPlantDead = plantEntity.health <= 0;

        if (isPlantDead) {
          this.garden.removeEntity(plantEntity);

          entity.action = "walking";
          entity.isDamaging = false;
        }
      } else {
        entity.action = "walking";
        entity.isDamaging = false;
      }

      return entity.isDamaging ? entity.damageSpeed : entity.speed;
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
