import { Plant } from "./plants/Plant";

type PlantInstanceType<T> = new (x: number, y: number) => T;
type PlantTool<T> = {
  Instance: PlantInstanceType<T>;
  selected: boolean;
  plant: T;
};

export class PlantMenu<T extends Plant> {
  plantTools: PlantTool<T>[] = [];

  selectedPlant: PlantTool<T> | null = null;

  constructor(private PlantInstances: PlantInstanceType<T>[]) {
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

    const FoundInstance = this.PlantInstances.find(
      (Instance) => selected?.plant instanceof Instance
    );

    if (selected && FoundInstance) {
      this.selectedPlant = { ...selected, Instance: FoundInstance };
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
