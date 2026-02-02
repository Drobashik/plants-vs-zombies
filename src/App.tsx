/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import type { Cell } from "./core/GardenMap";
import flagImage from "./images/flag.webp";
import type { Entity } from "./core/entities/Entity";
import sunImage from "./images/sun.webp";
import { gameManager, plantManager } from "./core";
import { MovingEntity } from "./core/entities/MovingEntity";

const buttonLabel = {
  idle: "Start",
  play: "Pause",
  pause: "Resume",
  win: "You won! Restart",
  lose: "You lost! Restart",
};

const MAX_BUDGET = 9999;

function App() {
  const [_, triggerRender] = useState(0);
  const rerender = () => triggerRender((prev) => prev + 1);

  useEffect(() => {
    gameManager.setRenderFn(rerender);
    plantManager.setRenderFn(rerender);
  }, []);

  const handleGameStartStop = () => {
    gameManager.executeGameAction();
  };

  const togglePlant = (plantName: string) => {
    plantManager.togglePlant(plantName);
  };

  const addPlant = (cell: Cell) => {
    const createdPlant = plantManager.addPlant(cell);

    if (!createdPlant) return;

    createdPlant.behavior?.start(gameManager.controller, createdPlant);
  };

  const pickEntity = (entity: Entity) => {
    plantManager.pickEntity(entity);
  };

  return (
    <div className="container">
      <div className="tool-menu">
        {plantManager.toolbox.plantTools.map((plantTool) => (
          <div
            key={plantTool.plant.name}
            className={`tool-plant ${plantTool.selected ? "selected" : ""} ${
              plantTool.disabled ||
              gameManager.gameState !== "play" ||
              plantTool.cooldownActive
                ? "disabled"
                : ""
            }`}
            onClick={() => togglePlant(plantTool.plant.name)}
          >
            {plantTool.cooldownActive && (
              <div
                className="cooldown"
                style={{
                  animationDuration: `${plantTool.plant.cooldown}ms`,
                }}
              ></div>
            )}
            <img
              src={plantTool.plant.image}
              alt={`${plantTool.plant.name} menu`}
            />
            <p className="tool-cost">{plantTool.plant.cost}</p>
          </div>
        ))}
      </div>

      <div className="game-container">
        <div className="head-panel">
          <div className="budget-container">
            <img src={sunImage} alt="" />
            <div className="budget">
              {Math.min(plantManager.budget.value, MAX_BUDGET)}
            </div>
          </div>

          {gameManager.gameState !== "idle" && (
            <div className="level-progression">
              <div className="flag-container">
                {Array.from({
                  length: gameManager.waveSpawner.totalFlags,
                }).map((_, index) => (
                  <img
                    className="flag"
                    src={flagImage}
                    alt="Flag"
                    key={index}
                  />
                ))}
                <div className="flag"></div>
              </div>
              <div
                className="progression"
                style={{
                  width: `${gameManager.waveSpawner.gameCompletion}%`,
                }}
              ></div>
            </div>
          )}

          <div className="controls">
            {buttonLabel[gameManager.gameState] && (
              <button onClick={handleGameStartStop}>
                {buttonLabel[gameManager.gameState]}
              </button>
            )}
          </div>
        </div>

        <div className="map">
          {gameManager.garden.cells.map((row, index) => (
            <div className="row" key={index}>
              {row.map((cell, index) => (
                <div
                  className={`cell ${
                    plantManager.toolbox.selectedPlant ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => addPlant(cell)}
                >
                  {cell.entities.map((entity) => (
                    <img
                      key={entity.id}
                      style={
                        entity instanceof MovingEntity
                          ? {
                              animationDuration: `${entity.speed + 0.1}ms`,
                            }
                          : {}
                      }
                      className={`entity ${entity.type} ${
                        gameManager.gameState !== "pause"
                          ? entity.action
                          : "paused"
                      } ${entity.isHurt ? "hurting" : ""} ${
                        entity.isRecentlyAppeared ? "first-appear" : ""
                      }`}
                      src={entity.image}
                      onClick={
                        entity.isPickable ? () => pickEntity(entity) : undefined
                      }
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
