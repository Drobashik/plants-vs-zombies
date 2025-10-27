import { GameLoop } from "./GameLoop";
import type { GardenMap } from "../GardenMap";
import type { Spawner } from "./Spawner";
import { Zombie } from "../zombies/Zombie";
import { Pea } from "../plants/Pea";
import type { Plant } from "../plants/Plant";

export class GameController {
  private render: () => void;
  public moveLoop = new GameLoop();

  constructor(private garden: GardenMap, private spawner: Spawner) {}

  private startZombieMove<T extends Zombie>(zombie: T) {
    this.moveLoop.setSpeed(zombie.speed)
  
    this.moveLoop.loop(() => {
      this.render();

      const isZombieAtEdge = zombie.x === 0;
      const isZombieDead = zombie.health <= 0;

      if ((isZombieAtEdge && !zombie.isDamaging) || isZombieDead) {
        this.garden.removeEntity(zombie);

        return true;
      }

      if (!zombie.isDamaging) {
        this.garden.removeEntity(zombie);
        zombie.makeStep();
        this.garden.placeEntity(zombie);
      }

      const plantEntity = this.garden
        .getCellEntities(zombie.x, zombie.y)
        .find((entity) => entity.type === "plant");

      if (plantEntity) {
        zombie.action = "damaging";
        zombie.isDamaging = true;

        plantEntity.takeDamage(zombie.damage);

        const isPlantEntityDead = plantEntity.health <= 0;

        if (isPlantEntityDead) {
          this.garden.removeEntity(plantEntity);

          zombie.action = "walking";
          zombie.isDamaging = false;
        }
      } else {
        zombie.action = "walking";
        zombie.isDamaging = false;
      }

      return zombie.isDamaging ? zombie.damageSpeed : zombie.speed;
    });
  }

  private startPeaShoot<T extends Pea, E extends Plant>(pea: T, plant: E) {
    this.moveLoop.setSpeed(0);
    this.moveLoop.loop(() => {
      this.render();

      const isPeaAtEdge = pea.x === this.garden.width - 1;

      if (isPeaAtEdge || !plant) {
        this.garden.removeEntity(pea);

        return true;
      }

      const getCellZombie = (x: number, y: number) =>
        this.garden
          .getCellEntities<Zombie>(x, y)
          .find((entity) => entity.type === "zombie");

      const zombie =
        getCellZombie(pea.x, pea.y) || getCellZombie(pea.x + 1, pea.y);

      if (zombie) {
        pea.action = "damaging";
        pea.isDamaging = true;

        zombie.takeDamage(pea.damage);

        this.garden.removeEntity(pea);

        const isZombieDead = zombie.health <= 0;

        if (isZombieDead) {
          this.garden.removeEntity(zombie);

          pea.action = "walking";
          pea.isDamaging = false;
        }
        return true;
      } else {
        pea.action = "walking";
        pea.isDamaging = false;
      }

      if (!pea.isDamaging) {
        this.garden.removeEntity(pea);
        pea.makeStep("right");
        this.garden.placeEntity(pea);
      }

      return pea.speed;
    });
  }

  startPlantShooting<T extends Plant>(render: () => void, createdPlant: T) {
    this.render = render;

    if (createdPlant.plantType !== "shooter") return;

    this.spawner.spawnLoop<Pea>(
      Pea,
      (pea) => {
        this.render();

        const plant = this.garden
          .getCellEntities<Plant>(createdPlant.x, createdPlant.y)
          .find((entity) => entity.id === createdPlant.id)!;

        const zombieInRow = this.garden
          .getRowEntitiesFrom(plant.x, plant.y)
          .find((entity) => entity instanceof Zombie);

        if (!plant) {
          return true;
        }

        if (zombieInRow) {
          this.garden.placeEntity(pea);
          this.startPeaShoot(pea, plant);
        }

        return [plant.damageSpeed, plant.damageSpeed];
      },
      createdPlant.x,
      createdPlant.y
    );
  }

  startSpanwingZombies(
    render: () => void,
    minSpawnInterval: number,
    maxSpawnInterval: number
  ) {
    this.render = render;

    const zombies = this.garden.getEntities(Zombie);

    for (const zombie of zombies) {
      this.startZombieMove(zombie);
    }

    this.spawner.spawnLoop<Zombie>(Zombie, (zombie) => {
      this.render();

      this.garden.placeEntity(zombie);

      this.startZombieMove(zombie);

      return [minSpawnInterval, maxSpawnInterval];
    });
  }
}
