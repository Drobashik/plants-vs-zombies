import { GARDEN_HEIGHT, GARDEN_WIDTH } from "../constants";
import { EntityController } from "./engine/EntityController";
import { Spawner } from "./engine/Spawner";
import type { EntityClass } from "./entities/Entity";
import { GardenMap, type Cell } from "./GardenMap";
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

  isGameStarted = false;

  isGamePlaying = false;

  render: () => void;

  constructor() {
    this.plantMenu = new PlantMenu([Sunflower, Peashooter]);
    this.ZombiesInCurrentGame = [Zombie, ConeHeadZombie, BucketHeadZombie];

    this.garden = new GardenMap(GARDEN_WIDTH, GARDEN_HEIGHT);
    this.spawner = new Spawner(this.garden);
    this.controller = new EntityController(this.garden, this.spawner);
  }

  setRenderFn(renderFn?: () => void) {
    const emtpyFn = () => {};

    this.render = renderFn || emtpyFn;
  }

  startGame() {
    if (!this.isGameStarted) {
      this.controller.startZombieActions(this.ZombiesInCurrentGame);

      this.isGameStarted = true;

      this.render();
    }
  }

  resumeOrPauseGame() {
    if (this.isGamePlaying) {
      this.controller.moveLoop.pauseAll();

      this.spawner.spawnerLoop.pauseAll();
    } else {
      this.controller.moveLoop.resumeAll();

      this.spawner.spawnerLoop.resumeAll();
    }

    this.isGamePlaying = !this.isGamePlaying;

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

    this.render();
  }

  togglePlant(plantName: string) {
    const plantTool = this.plantMenu.getPlantTool(plantName);

    this.plantMenu.togglePlantSelection(plantName, !plantTool?.selected);

    this.render();
  }
}
