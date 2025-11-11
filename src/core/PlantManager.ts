import type { Budget } from "./Budget";
import type { EntityController } from "./engine/EntityController";
import type { Entity } from "./entities/Entity";
import type { Cell, GardenMap } from "./GardenMap";
import type { PlantToolbox } from "./PlantToolbox";

export class PlantManager {
  constructor(
    private _toolbox: PlantToolbox,
    private _budget: Budget,
    private garden: GardenMap
  ) {}

  get budget() {
    return this._budget;
  }

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

    this._budget.decreaseBudget(createdPlant.cost);

    this._toolbox.checkPlantsDisabled(this._budget.value);

    createdPlant.behavior.start(controller, createdPlant);
  }

  pickEntity(entity: Entity & { profit: number }) {
    this._budget.increaseBudget(entity.profit);

    this._toolbox.checkPlantsDisabled(this._budget.value);

    this.garden.removeEntity(entity);
  }

  togglePlant(plantName: string) {
    const plantTool = this._toolbox.getPlantTool(plantName);

    this._toolbox.togglePlantSelection(plantName, !plantTool?.selected);
  }
}
