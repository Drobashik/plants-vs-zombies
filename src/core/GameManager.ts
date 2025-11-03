import { GARDEN_HEIGHT, GARDEN_WIDTH } from "../constants";
import { EntityController } from "./engine/EntityController";
import { Spawner } from "./engine/Spawner";
import type { Entity } from "./entities/Entity";
import { FlagWaveGenerator } from "./FlagWaveGenerator";
import { GardenMap, type Cell } from "./GardenMap";
import { PlantMenu } from "./PlantMenu";
import { Peashooter } from "./plants/Peashooter";
import type { Plant } from "./plants/Plant";
import { Sunflower } from "./plants/Sunflower";
import { WaveEntitySpawner } from "./WaveEntitySpawner";
import { Zombie } from "./zombies/Zombie";

export class GameManager {
  garden: GardenMap;

  spawner: Spawner;

  plantMenu: PlantMenu;

  controller: EntityController;

  gameState: "idle" | "play" | "pause" | "win" | "lose" = "idle";

  waveSpawner: WaveEntitySpawner;

  flagsCount = 0;

  render: () => void;

  constructor() {
    this.plantMenu = new PlantMenu<Plant>([Sunflower, Peashooter]);

    this.garden = new GardenMap(GARDEN_WIDTH, GARDEN_HEIGHT);
    this.spawner = new Spawner();

    const { flags } = new FlagWaveGenerator([
      { weightEntities: [{ Entity: Zombie, weight: 10 }], difficulty: 0.5 },
      { weightEntities: [{ Entity: Zombie, weight: 10 }], difficulty: 1.2 },
    ]);

    this.flagsCount = flags.length;

    this.waveSpawner = new WaveEntitySpawner(flags);
    this.controller = new EntityController(
      this.garden,
      this.spawner,
      this.waveSpawner,
      {
        onTick: () => {
          this.render();
        },
        onGameOver: () => {},
      }
    );
  }

  setRenderFn(renderFn?: () => void) {
    const emtpyFn = () => {};

    this.render = renderFn || emtpyFn;
  }

  startGame() {
    if (this.gameState === "idle") {
      this.controller.startZombieActions();
      this.controller.startRandomSunSpawn();

      this.gameState = "play";

      this.render();
    }
  }

  endGame(outcome: "win" | "lose") {
    this.gameState = outcome;

    this.controller.moveLoop.stopAll();
    this.spawner.spawnerLoop.stopAll();
    this.waveSpawner.waveLoop.stopAll();

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
      this.spawner.spawnerLoop.pauseAll();
      this.waveSpawner.waveLoop.pauseAll();

      this.gameState = "pause";
    } else if (this.gameState === "pause") {
      this.controller.moveLoop.resumeAll();
      this.spawner.spawnerLoop.resumeAll();
      this.waveSpawner.waveLoop.resumeAll();

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
