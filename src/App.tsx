/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { GardenMap } from "./core/GardenMap";
import { GameLoop } from "./core/GameLoop";
import { getRandom, Spawner } from "./core/Spawner";
import { GameController } from "./core/GameController";

const MIN_SPAWN_INTERVAL = 10000;
const MAX_SPANW_INTERVAL = 40000;

const GARDEN_WIDTH = 5;
const GARDEN_HEIGHT = 9;

const garden = new GardenMap(GARDEN_WIDTH, GARDEN_HEIGHT);

const moveLoop = new GameLoop();

const spawner = new Spawner(
  garden,
  new GameLoop(getRandom(MIN_SPAWN_INTERVAL, MAX_SPANW_INTERVAL)),
  MIN_SPAWN_INTERVAL,
  MAX_SPANW_INTERVAL
);

const gameController = new GameController(garden, spawner, moveLoop);

function App() {
  const [_, triggerRender] = useState(0);

  const [isGameStarted, setGameStarted] = useState(false);

  const isPlaying = useRef(false);

  useEffect(() => {
    if (!isGameStarted) return;

    gameController.bootstrapGame(() => triggerRender((prev) => prev + 1));
  }, [isGameStarted]);

  const handleGameStartStop = () => {
    if (isPlaying.current) {
      moveLoop.clearFullLoop();

      spawner.gameLoop.clearFullLoop();
    }

    isPlaying.current = !isPlaying.current;
    setGameStarted((prev) => !prev);
  };

  console.log(garden.cells)

  return (
    <div className="container">
      <div className="controls">
        <button onClick={handleGameStartStop}>
          {isGameStarted ? "Stop Game" : "Start Game"}
        </button>
      </div>

      {garden.cells.map((row, index) => (
        <div className="row" key={index}>
          {row.map((cell, index) => (
            <div className="cell" key={index}>
              {cell.entity && (
                <img
                  style={{
                    opacity: 1,
                    animationDuration: `${cell.entity.speed}ms`,
                  }}
                  className={`entity ${cell.entity?.name.toLowerCase()} ${
                    isGameStarted ? "walking" : "paused"
                  }`}
                  src={cell.entity?.image}
                  alt={cell.entity?.name}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
