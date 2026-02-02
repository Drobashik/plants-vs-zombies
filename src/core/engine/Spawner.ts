import { Entity } from "../entities/Entity";
import { Random } from "../utils/Random";
import { GameLoop } from "./GameLoop";

type MsRange = { min: number; max: number };

type SpawnOptions = {
  type: "instant" | "delay";
  delaying: () => MsRange[];
  spawn: () => "stop" | "continue";
};

export class Spawner {
  private _spawnerLoop = new GameLoop();

  get spawnerLoop() {
    return this._spawnerLoop;
  }

  spawnLoop<T extends Entity>(
    createEntity: () => T,
    retrieveSpawnOptions: (entity: T) => SpawnOptions
  ) {
    let waitingForDelay = true;
    let delayCount = 0;

    const random = new Random();

    this._spawnerLoop.loop(() => {
      const { spawn, delaying, type } = retrieveSpawnOptions(createEntity());

      const delays = delaying();

      const { min, max } = delays[delayCount];

      if (delayCount < delays.length - 1) {
        delayCount++;
      }

      const delayTime = random.next(min, max);

      if (type === "instant") {
        const decision = spawn();

        if (decision === "stop") {
          return true;
        }
      }

      if (type === "delay") {
        if (!waitingForDelay) {
          const decision = spawn();

          if (decision === "stop") {
            return true;
          }
        }

        waitingForDelay = false;
      }

      return delayTime;
    });
  }
}
