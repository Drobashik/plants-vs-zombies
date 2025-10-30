import { GARDEN_HEIGHT, GARDEN_WIDTH } from "../constants";
import { EntityController } from "./engine/EntityController";
import { Spawner } from "./engine/Spawner";
import type { EntityClass } from "./entities/Entity";
import { GardenMap, type Cell } from "./GardenMap";
import { LevelDirector } from "./LevelDirector";
import { PlantMenu } from "./PlantMenu";
import { Peashooter } from "./plants/Peashooter";
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

  render: () => void;

  constructor() {
    this.plantMenu = new PlantMenu([Sunflower, Peashooter]);
    this.ZombiesInCurrentGame = [Zombie, ConeHeadZombie, BucketHeadZombie];

    this.garden = new GardenMap(GARDEN_WIDTH, GARDEN_HEIGHT);
    this.spawner = new Spawner(this.garden);

    this.levelDirector = new LevelDirector(1, {
      onTick: () => {
        this.render();
      },
      onGameOver: () => {
        this.controller.triggerGameOver("win");
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
        this.controller.startZombieActions(this.ZombiesInCurrentGame);
      }, 15000);

      this.gameState = "play";

      this.render();
    }
  }

  endGame(outcome: "win" | "lose") {
    this.gameState = outcome;

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
    } else {
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

    this.controller.startPlantActions(createdPlant);

    this.startGame();

    this.render();
  }

  togglePlant(plantName: string) {
    const plantTool = this.plantMenu.getPlantTool(plantName);

    this.plantMenu.togglePlantSelection(plantName, !plantTool?.selected);

    this.render();
  }
}
