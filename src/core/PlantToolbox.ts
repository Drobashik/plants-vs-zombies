import { INITIAL_BUDGET } from "../constants";
import type { EntityClass } from "./entities/Entity";
import { Plant } from "./plants/Plant";

type PlantTool<T> = {
  Instance: EntityClass<T>;
  selected: boolean;
  disabled: boolean;
  cooldownActive: boolean;
  plant: T;
};

export class PlantToolbox<T extends Plant = Plant> {
  private _plantTools: PlantTool<T>[] = [];

  private _selectedPlant: PlantTool<T> | null = null;

  constructor(private PlantInstances: EntityClass<T>[]) {
    for (const PlantInstance of this.PlantInstances) {
      const plant = new PlantInstance(0, 0);

      this._plantTools.push({
        Instance: PlantInstance,
        selected: false,
        disabled: INITIAL_BUDGET < plant.cost,
        cooldownActive: false,
        plant,
      });
    }
  }

  get plantTools() {
    return this._plantTools;
  }

  get selectedPlant() {
    return this._selectedPlant;
  }

  toggleCooldown(plantName: string, value: boolean) {
    return this._plantTools.map((plantTool) =>
      plantTool.plant.name === plantName
        ? {
            ...plantTool,
            cooldownActive: value,
          }
        : plantTool
    );
  }

  setPlantTools(plantTools: PlantTool<T>[]) {
    this._plantTools = plantTools;
  }

  applyCooldown(plant: Plant) {
    this._plantTools = this.toggleCooldown(plant.name, true);

    setTimeout(() => {
      this._plantTools = this.toggleCooldown(plant.name, false);
    }, plant.cooldown);
  }

  checkPlantsDisabled(budgetValue: number) {
    this._plantTools = this._plantTools.map((tool) => ({
      ...tool,
      disabled: budgetValue < tool.plant.cost,
    }));
  }

  togglePlantSelection(plantName: string, value: boolean) {
    this._plantTools = this._plantTools.map((plantTool) => ({
      ...plantTool,
      selected: plantTool.plant.name === plantName ? value : false,
    }));

    const selected = this._plantTools.find((plant) => plant.selected);

    const SelectedInstance = this.PlantInstances.find(
      (Instance) => selected?.plant instanceof Instance
    );

    if (selected && SelectedInstance) {
      this._selectedPlant = { ...selected, Instance: SelectedInstance };
    } else {
      this._selectedPlant = null;
    }

    return this._plantTools;
  }

  getPlantTool(plantName: string) {
    return this._plantTools.find(
      (plantTool) => plantTool.plant.name === plantName
    );
  }

  createPlant(x: number, y: number) {
    if (!this._selectedPlant) return null;

    const PlantInstance = this._selectedPlant.Instance;

    return new PlantInstance(x, y);
  }
}
