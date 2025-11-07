import { GARDEN_HEIGHT, GARDEN_WIDTH } from "../constants";
import { EntityController } from "./engine/EntityController";
import type { GameLoop } from "./engine/GameLoop";
import { Spawner } from "./engine/Spawner";
import { Entity } from "./entities/Entity";
import { FlagWaveGenerator } from "./FlagWaveGenerator";
import { GardenMap, type Cell } from "./GardenMap";
import { PlantMenu } from "./PlantMenu";
import { Peashooter } from "./plants/Peashooter";
import type { Plant } from "./plants/Plant";
import { Sunflower } from "./plants/Sunflower";
import { WaveEntitySpawner } from "./WaveEntitySpawner";
import { BucketHeadZombie } from "./zombies/BucketHeadZombie";
import { ConeHeadZombie } from "./zombies/ConeHeadZombie";
import { Zombie } from "./zombies/Zombie";

const level = [
  {
    weightEntities: [
      { Entity: Zombie, weight: 12 },
      { Entity: ConeHeadZombie, weight: 3 },
      { Entity: BucketHeadZombie, weight: 1 },
    ],
    difficulty: 0.5,
  },
  {
    weightEntities: [
      { Entity: Zombie, weight: 12 },
      { Entity: ConeHeadZombie, weight: 3 },
      { Entity: BucketHeadZombie, weight: 1 },
    ],
    difficulty: 1.2,
  },
];

export class GameManager {
  garden: GardenMap;

  spawner: Spawner;

  plantMenu: PlantMenu;

  controller: EntityController;

  gameState: "idle" | "play" | "pause" | "win" | "lose" = "idle";

  waveSpawner: WaveEntitySpawner;

  loops: GameLoop[] = [];

  render: () => void;

  constructor() {
    this.plantMenu = new PlantMenu<Plant>([Sunflower, Peashooter]);

    this.garden = new GardenMap(GARDEN_WIDTH, GARDEN_HEIGHT);
    this.spawner = new Spawner();

    const { flags } = new FlagWaveGenerator(level);

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

    this.loops.push(
      this.controller.moveLoop,
      this.waveSpawner.waveLoop,
      this.spawner.spawnerLoop
    );
  }

  private stopAllLoops() {
    for (const loop of this.loops) loop.stopAll();
  }

  private pauseAllLoops() {
    for (const loop of this.loops) loop.pauseAll();

    this.gameState = "pause";
  }

  private resumeAllLoops() {
    for (const loop of this.loops) loop.resumeAll();

    this.gameState = "play";
  }

  setRenderFn(renderFn?: () => void) {
    const emtpyFn = () => {};

    this.render = renderFn || emtpyFn;
  }

  restartGame() {
    this.gameState = "idle";

    this.garden.removeAllEntities();

    this.startGame();
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

    this.stopAllLoops();

    this.render();
  }

  resumeOrPauseGame() {
    switch (this.gameState) {
      case "pause":
        this.resumeAllLoops();
        break;
      case "play":
        this.pauseAllLoops();
        break;
      case "lose":
        this.restartGame();
        break;
      default:
        break;
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
