import type { EntityController } from "./engine/EntityController";
import type { Entity } from "./entities/Entity";
import type { Cell, GardenMap } from "./GardenMap";
import type { PlantToolbox } from "./PlantToolbox";

export class PlantManager {
  constructor(private _toolbox: PlantToolbox, private garden: GardenMap) {}

  get toolbox() {
    return this._toolbox;
  }

  addPlant(cell: Cell, controller: EntityController) {
    const createdPlant = this._toolbox.createPlant(cell.x, cell.y);

    const cellPlant = this.garden
      .getCellEntities(cell.x, cell.y)
      .find((entity) => entity.type === createdPlant?.type);

    if (!createdPlant || cellPlant) return;

    this._toolbox.togglePlantSelection(createdPlant.name, false);

    this.garden.placeEntity(createdPlant);

    this._toolbox.decreaseBudget(createdPlant.cost);

    createdPlant.behavior.start(controller, createdPlant);
  }

  pickEntity(entity: Entity & { profit: number }) {
    this._toolbox.increaseBudget(entity.profit);

    this.garden.removeEntity(entity);
  }

  togglePlant(plantName: string) {
    const plantTool = this._toolbox.getPlantTool(plantName);

    this._toolbox.togglePlantSelection(plantName, !plantTool?.selected);
  }
}
