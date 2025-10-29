/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import type { Cell } from "./core/GardenMap";
import { GameManager } from "./core/GameManager";

const manager = new GameManager();

function App() {
  const [_, triggerRender] = useState(0);
  const rerender = () => triggerRender((prev) => prev + 1);

  useEffect(() => {
    manager.setRenderFn(rerender);
    manager.controller.setRenderFn(rerender);
  }, []);

  const handleGameStartStop = () => {
    manager.resumeOrPauseGame();
    manager.startGame();
  };

  const togglePlant = (plantName: string) => {
    manager.togglePlant(plantName);
  };

  const addPlant = (cell: Cell) => {
    manager.addPlant(cell);
  };

  return (
    <div className="container">
      <div className="head-panel">
        <div className="tool-menu">
          {manager.plantMenu.plantTools.map((plantTool) => (
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
            {manager.isGamePlaying
              ? "Pause Game"
              : manager.isGameStarted
              ? "Resume Game"
              : "Start Game"}
          </button>
        </div>
      </div>

      <div className="map">
        {manager.garden.cells.map((row, index) => (
          <div className="row" key={index}>
            {row.map((cell, index) => (
              <div className="cell" key={index} onClick={() => addPlant(cell)}>
                {cell.entities.map((entity) => (
                  <img
                    key={entity.id}
                    style={
                      entity.type !== "plant"
                        ? {
                            animationDuration: `${entity.speed + 1}ms`,
                          }
                        : {}
                    }
                    className={`entity ${entity.type} ${
                      manager.isGamePlaying ? entity.action : "paused"
                    } ${entity.isHurt ? "hurting" : ""} ${entity.isRecentlyAppeared ? 'first-appear' : ''}`}
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
