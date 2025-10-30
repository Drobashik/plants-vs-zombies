import type { EntityClass } from "./entities/Entity";
import { Plant } from "./plants/Plant";

type PlantTool<T> = {
  Instance: EntityClass<T>;
  selected: boolean;
  plant: T;
};

export class PlantMenu<T extends Plant = Plant> {
  plantTools: PlantTool<T>[] = [];

  budget = 50;

  selectedPlant: PlantTool<T> | null = null;

  constructor(private PlantInstances: EntityClass<T>[]) {
    for (const PlantInstance of this.PlantInstances) {
      this.plantTools.push({
        Instance: PlantInstance,
        selected: false,
        plant: new PlantInstance(0, 0),
      });
    }
  }

  togglePlantSelection(plantName: string, value: boolean) {
    this.plantTools = this.plantTools.map((plantTool) => ({
      ...plantTool,
      selected: plantTool.plant.name === plantName ? value : false,
    }));

    const selected = this.plantTools.find((plant) => plant.selected);

    const SelectedInstance = this.PlantInstances.find(
      (Instance) => selected?.plant instanceof Instance
    );

    if (selected && SelectedInstance) {
      this.selectedPlant = { ...selected, Instance: SelectedInstance };
    } else {
      this.selectedPlant = null;
    }

    return this.plantTools;
  }

  getPlantTool(plantName: string) {
    return this.plantTools.find(
      (plantTool) => plantTool.plant.name === plantName
    );
  }

  createPlant(x: number, y: number) {
    if (!this.selectedPlant) return null;

    const PlantInstance = this.selectedPlant.Instance;

    return new PlantInstance(x, y);
  }
}
