import { GARDEN_HEIGHT, GARDEN_WIDTH } from "../constants";
import { EntityController } from "./engine/EntityController";
import { Spawner } from "./engine/Spawner";
import type { Entity, EntityClass } from "./entities/Entity";
import { GardenMap, type Cell } from "./GardenMap";
import { LevelDirector } from "./LevelDirector";
import { PlantMenu } from "./PlantMenu";
import { Peashooter } from "./plants/Peashooter";
import type { Plant } from "./plants/Plant";
import { Sunflower } from "./plants/Sunflower";
import { BucketHeadZombie } from "./zombies/BucketHeadZombie";
import { ConeHeadZombie } from "./zombies/ConeHeadZombie";
import { Zombie } from "./zombies/Zombie";

export class GameManager {
  garden: GardenMap;

  spawner: Spawner;

  plantMenu: PlantMenu;

  controller: EntityController;

  ZombiesInCurrentGame: EntityClass<Zombie>[];

  gameState: "idle" | "play" | "pause" | "win" | "lose" = "idle";

  levelDirector: LevelDirector;

  zombieSpawnerIds: number[];

  render: () => void;

  constructor() {
    this.plantMenu = new PlantMenu<Plant>([Sunflower, Peashooter]);
    this.ZombiesInCurrentGame = [Zombie, ConeHeadZombie, BucketHeadZombie];

    this.garden = new GardenMap(GARDEN_WIDTH, GARDEN_HEIGHT);
    this.spawner = new Spawner();

    this.levelDirector = new LevelDirector(1, {
      onTick: () => {
        this.render();
      },
      onGameOver: () => {
        for (const id of this.zombieSpawnerIds) {
          this.spawner.spawnerLoop.stop(id);
        }

        const zombies = this.garden.getEntities([Zombie]);

        if (!zombies.length) {
          this.endGame("win");
        }

        return Boolean(!zombies.length);
      },
    });

    this.controller = new EntityController(this.garden, this.spawner, {
      onTick: () => {
        this.render();
      },
      onGameOver: () => {
        this.levelDirector.stopLevel();
        this.endGame("lose");
      },
    });
  }

  setRenderFn(renderFn?: () => void) {
    const emtpyFn = () => {};

    this.render = renderFn || emtpyFn;
  }

  startGame() {
    if (this.gameState === "idle") {
      this.levelDirector.startLevel(() => {
        this.zombieSpawnerIds = this.controller.startZombieActions(
          this.ZombiesInCurrentGame
        );
      }, 15000);

      this.controller.startRandomSunSpawn();

      this.gameState = "play";

      this.render();
    }
  }

  endGame(outcome: "win" | "lose") {
    this.gameState = outcome;

    this.controller.moveLoop.stopAll();
    this.spawner.spawnerLoop.stopAll();

    this.render();
  }

  resumeOrPauseGame() {
    if (this.gameState === "lose") {
      this.gameState = "idle";

      this.garden.removeAllEntities();

      this.startGame();

      return;
    }

    if (this.gameState === "play") {
      this.controller.moveLoop.pauseAll();
      this.levelDirector.pauseLevel();
      this.spawner.spawnerLoop.pauseAll();

      this.gameState = "pause";
    } else if (this.gameState === "pause") {
      this.controller.moveLoop.resumeAll();
      this.levelDirector.resumeLevel();
      this.spawner.spawnerLoop.resumeAll();

      this.gameState = "play";
    }

    this.render();
  }

  addPlant(cell: Cell) {
    const createdPlant = this.plantMenu.createPlant(cell.x, cell.y);

    const cellPlant = this.garden
      .getCellEntities(cell.x, cell.y)
      .find((entity) => entity.type === createdPlant?.type);

    if (!createdPlant || cellPlant) return;

    this.plantMenu.togglePlantSelection(createdPlant.name, false);

    this.garden.placeEntity(createdPlant);

    this.plantMenu.decreaseBudget(createdPlant.cost);

    this.controller.startPlantActions(createdPlant);

    this.render();
  }

  pickEntity(entity: Entity) {
    if (entity.type === "profit") {
      this.plantMenu.increaseBudget(entity.profit);

      this.garden.removeEntity(entity);
    }

    this.render();
  }

  togglePlant(plantName: string) {
    const plantTool = this.plantMenu.getPlantTool(plantName);

    this.plantMenu.togglePlantSelection(plantName, !plantTool?.selected);

    this.render();
  }
}
