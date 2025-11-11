import { Entity } from "../entities/Entity";
import { GameLoop } from "./GameLoop";

export type RandomPosition = {
  min: number;
  max: number;
};

type MsRange = { min: number; max: number };

type SpawnOptions = {
  type: "instant" | "delay";
  delays: MsRange[];
  spawn: () => "stop" | "continue";
};

export const getRandom = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

export class Spawner {
  _spawnerLoop = new GameLoop();

  get spawnerLoop() {
    return this._spawnerLoop;
  }

  spawnLoop<T extends Entity>(
    createEntity: () => T,
    retrieveSpawnOptions: (entity: T) => SpawnOptions
  ) {
    let waitingForDelay = true;
    let delayCount = 0;

    this._spawnerLoop.loop(() => {
      const { spawn, delays, type } = retrieveSpawnOptions(createEntity());

      const { min, max } = delays[delayCount];

      if (delayCount < delays.length - 1) {
        delayCount++;
      }

      const delayTime = getRandom(min, max);

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
