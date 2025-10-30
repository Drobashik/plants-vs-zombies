/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import type { Cell } from "./core/GardenMap";
import { GameManager } from "./core/GameManager";
import flagImage from "./images/flag.webp";

const manager = new GameManager();

const buttonLabel = {
  idle: false,
  play: "Pause Game",
  pause: "Resume Game",
  win: "Start again",
  lose: "Start again",
};

function App() {
  const [_, triggerRender] = useState(0);
  const rerender = () => triggerRender((prev) => prev + 1);

  useEffect(() => {
    manager.setRenderFn(rerender);
  }, []);

  const handleGameStartStop = () => {
    manager.resumeOrPauseGame();
  };

  const togglePlant = (plantName: string) => {
    manager.togglePlant(plantName);
  };

  const addPlant = (cell: Cell) => {
    manager.addPlant(cell);
  };

  const progressionLevel = useMemo(
    () => manager.levelDirector.gameCompletion,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [manager.levelDirector.gameCompletion]
  );

  return (
    <div className="container">
      <div className="head-panel">
        <div className="controls">
          {buttonLabel[manager.gameState] && (
            <button onClick={handleGameStartStop}>
              {buttonLabel[manager.gameState]}
            </button>
          )}
        </div>

        {buttonLabel[manager.gameState] && (
          <div className="level-progression">
            <div className="flag-container">
              {Array.from({ length: manager.levelDirector.flags }).map(
                (_, index) => (
                  <img
                    className="flag"
                    src={flagImage}
                    alt="Flag"
                    key={index}
                  />
                )
              )}
              <div className="flag"></div>
            </div>
            <div
              className="progression"
              style={{ width: `${progressionLevel}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="game-container">
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

        <div className="map">
          {manager.garden.cells.map((row, index) => (
            <div className="row" key={index}>
              {row.map((cell, index) => (
                <div
                  className="cell"
                  key={index}
                  onClick={() => addPlant(cell)}
                >
                  {cell.entities.map((entity) => (
                    <img
                      key={entity.id}
                      style={{
                        animationDuration: `${entity.speed + 1}ms`,
                      }}
                      className={`entity ${entity.type} ${
                        manager.gameState === "play" ? entity.action : "paused"
                      } ${entity.isHurt ? "hurting" : ""} ${
                        entity.isRecentlyAppeared ? "first-appear" : ""
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
    </div>
  );
}

export default App;
