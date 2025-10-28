/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { GardenMap } from "./core/GardenMap";
import { Spawner } from "./core/engine/Spawner";
import { GameController } from "./core/engine/GameController";
import { GARDEN_HEIGHT, GARDEN_WIDTH } from "./constants";
import { PlantMenu } from "./core/PlantMenu";
import { Sunflower } from "./core/plants/Sunflower";
import { Peashooter } from "./core/plants/Peashooter";
import { Zombie } from "./core/zombies/Zombie";
import { ConeHeadZombie } from "./core/zombies/ConeHeadZombie";
import { BucketHeadZombie } from "./core/zombies/BucketHeadZombie";

const garden = new GardenMap(GARDEN_WIDTH, GARDEN_HEIGHT);

const spawner = new Spawner(garden);

const plantMenu = new PlantMenu([Sunflower, Peashooter]);

const gameController = new GameController(garden, spawner);

let isStarted = false;

function App() {
  const [_, triggerRender] = useState(0);
  const rerender = () => triggerRender((prev) => prev + 1);

  const [isGameStarted, setGameStarted] = useState(false);

  const isPlaying = useRef(false);

  useEffect(() => {
    gameController.setRenderFn(rerender);
  }, []);

  const handleGameStartStop = () => {
    if (isPlaying.current) {
      gameController.moveLoop.pauseAll();

      spawner.spawnerLoop.pauseAll();
    } else {
      gameController.moveLoop.resumeAll();

      spawner.spawnerLoop.resumeAll();
    }

    if (!isStarted) {
      gameController.startZombieActions([
        Zombie,
        ConeHeadZombie,
        BucketHeadZombie,
      ]);

      isStarted = true;
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
    const createdPlant = plantMenu.createPlant(x, y);

    if (!createdPlant) return;

    garden.placeEntity(createdPlant);

    gameController.startPlantActions(createdPlant);

    rerender();
  };

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
            {isGameStarted
              ? "Pause Game"
              : isStarted
              ? "Resume Game"
              : "Start Game"}
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
                    style={
                      entity.type !== "plant"
                        ? {
                            animationDuration: `${entity.speed}ms`,
                          }
                        : {}
                    }
                    className={`entity ${entity.type} ${
                      isGameStarted ? entity.action : "paused"
                    }`}
                    src={entity.image}
                    data-id={entity.id}
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
