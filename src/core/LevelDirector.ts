import type { GameLyfecycle } from "./engine/EntityController";
import { GameLoop } from "./engine/GameLoop";

type LevelState = {
  loopId?: number;
  durationMs: number;
  elapsedMs: number;
  lastStamp: number;
  paused: boolean;
};

export class LevelDirector {
  levelLoop = new GameLoop(250);
  private oneFlagInterval = 5 * 60 * 1000; // 5 mins
  gameCompletion = 0;

  private state?: LevelState;

  constructor(public flags: number, private gameLifecycle: GameLyfecycle) {}

  startLevel(startFn: () => void, timeWaitToStart: number) {
    const duration = this.oneFlagInterval * this.flags;

    this.gameCompletion = 0;

    this.state = {
      loopId: undefined,
      durationMs: duration,
      elapsedMs: 0,
      lastStamp: performance.now(),
      paused: false,
    };

    let wait = true;
    let start = false;

    const loopId = this.levelLoop.loop(() => {
      const state = this.state!;

      if (start) {
        state.lastStamp = performance.now();

        startFn();

        start = false;
      }

      if (wait) {
        wait = false;

        start = true;

        return timeWaitToStart;
      }

      if (state.paused) {
        state.lastStamp = performance.now();
        return;
      }

      const now = performance.now();
      const dt = now - state.lastStamp;
      state.lastStamp = now;

      state.elapsedMs += dt;

      this.gameLifecycle.onTick();

      if (state.elapsedMs >= state.durationMs) {
        return this.gameLifecycle.onGameOver("win");
      }

      this.gameCompletion = (state.elapsedMs / state.durationMs) * 100;
    });

    this.state.loopId = loopId;
  }

  pauseLevel() {
    const state = this.state;
    if (!state || state.paused || state.loopId === undefined) return;

    state.paused = true;
    this.levelLoop.pause(state.loopId);
  }

  resumeLevel() {
    const state = this.state;
    if (!state || !state.paused || state.loopId === undefined) return;

    state.paused = false;
    state.lastStamp = performance.now();
    this.levelLoop.resume(state.loopId);
  }

  stopLevel() {
    const state = this.state;
    if (!state || state.loopId === undefined) return;

    this.levelLoop.stop(state.loopId);
    this.state = undefined;
  }
}
