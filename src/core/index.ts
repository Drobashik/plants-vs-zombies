import { GARDEN_HEIGHT, GARDEN_WIDTH } from "../constants";
import { Budget } from "./Budget";
import { level, plants } from "./data/levelData";
import { FlagWaveGenerator } from "./engine/FlagWaveGenerator";
import { GameManager } from "./GameManager";
import { GardenMap } from "./GardenMap";
import { PlantManager } from "./PlantManager";
import type { Plant } from "./plants/Plant";
import { PlantToolbox } from "./PlantToolbox";

const gardenMap = new GardenMap(GARDEN_WIDTH, GARDEN_HEIGHT);

const { flags } = new FlagWaveGenerator(level);

export const gameManager = new GameManager(gardenMap, flags);

export const plantManager = new PlantManager(
  new PlantToolbox<Plant>(plants),
  new Budget(),
  gardenMap
);
