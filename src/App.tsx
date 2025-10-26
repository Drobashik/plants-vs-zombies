/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { GardenMap } from "./core/GardenMap";
import { GameLoop } from "./core/engine/GameLoop";
import { Spawner } from "./core/engine/Spawner";
import { GameController } from "./core/engine/GameController";
import {
  GARDEN_HEIGHT,
  GARDEN_WIDTH,
  MAX_SPANW_INTERVAL,
  MIN_SPAWN_INTERVAL,
} from "./constants";
import { PlantMenu } from "./core/PlantMenu";
import { Sunflower } from "./core/plants/Sunflower";
import { Peashooter } from "./core/plants/Peashooter";

const garden = new GardenMap(GARDEN_WIDTH, GARDEN_HEIGHT);

const moveLoop = new GameLoop();

const spawner = new Spawner(
  garden,
  MIN_SPAWN_INTERVAL,
  MAX_SPANW_INTERVAL,
  new GameLoop()
);

const plantMenu = new PlantMenu([Sunflower, Peashooter]);

const gameController = new GameController(garden, spawner, moveLoop);

function App() {
  const [_, triggerRender] = useState(0);
  const rerender = () => triggerRender((prev) => prev + 1);

  const [isGameStarted, setGameStarted] = useState(false);

  const isPlaying = useRef(false);

  useEffect(() => {
    if (!isGameStarted) return;

    gameController.bootstrapGame(rerender);
  }, [isGameStarted]);

  const handleGameStartStop = () => {
    if (isPlaying.current) {
      moveLoop.clearLoop();

      spawner.spawnerLoop.clearLoop();
    }

    isPlaying.current = !isPlaying.current;
    setGameStarted((prev) => !prev);
  };

  const togglePlant = (plantName: string) => {
    const plantTool = plantMenu.getPlantTool(plantName);

    plantMenu.togglePlantSelection(plantName, !plantTool?.selected);

    rerender();
  };

  const addPlant = (x: number, y: number) => {
    const createdEntity = plantMenu.createPlant(x, y);

    if (!createdEntity) return;

    garden.placeEntity(createdEntity);

    rerender();
  };

  console.log(garden.cells);

  return (
    <div className="container">
      <div className="head-panel">
        <div className="tool-menu">
          {plantMenu.plantTools.map((plantTool) => (
            <div
              key={plantTool.plant.name}
              className={`tool-plant ${plantTool.selected ? "selected" : ""}`}
              onClick={() => togglePlant(plantTool.plant.name)}
            >
              <img
                src={plantTool.plant.image}
                alt={`${plantTool.plant.name} menu`}
              />
            </div>
          ))}
        </div>

        <div className="controls">
          <button onClick={handleGameStartStop}>
            {isGameStarted ? "Stop Game" : "Start Game"}
          </button>
        </div>
      </div>

      <div className="map">
        {garden.cells.map((row, index) => (
          <div className="row" key={index}>
            {row.map((cell, index) => (
              <div
                className="cell"
                key={index}
                onClick={() => addPlant(cell.x, cell.y)}
              >
                {cell.entities.map((entity) => (
                  <img
                    key={entity.id}
                    style={{
                      animationDuration: `${entity.speed}ms`,
                    }}
                    className={`entity ${entity.name.toLowerCase()} ${
                      isGameStarted ? "walking" : "paused"
                    }`}
                    src={entity.image}
                    alt={entity.name}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
