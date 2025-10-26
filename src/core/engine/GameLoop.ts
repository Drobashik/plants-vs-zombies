type TimerId = ReturnType<typeof setTimeout>;

export interface LoopHandle {
  stop(): void;
  isActive(): boolean;
}

export class GameLoop {
  private timers = new Set<TimerId>();

  constructor(private gameSpeed: number = 0) {
    this.gameSpeed = Math.max(0, gameSpeed | 0);
  }

  setSpeed(ms: number) {
    this.gameSpeed = Math.max(0, ms | 0);
  }

  loop(renderFn: () => boolean | number | void): LoopHandle {
    let active = true;
    let timerId: TimerId | undefined;

    const sanitize = (n: number) => Math.max(0, n | 0);

    let nextAt = performance.now() + this.gameSpeed;

    const schedule = () => {
      if (!active) return;

      const wait = Math.max(0, nextAt - performance.now());

      timerId = setTimeout(tick, wait);

      this.timers.add(timerId);
    };

    const tick = () => {
      if (!active) return;

      if (timerId) this.timers.delete(timerId);

      const res = renderFn();

      if (res === true) {
        stop();
        return;
      }

      const nextDelay =
        typeof res === "number" ? sanitize(res) : this.gameSpeed;

      nextAt += nextDelay;
      schedule();
    };

    const stop = () => {
      if (!active) return;

      active = false;

      if (timerId) {
        clearTimeout(timerId);

        this.timers.delete(timerId);

        timerId = undefined;
      }
    };

    schedule();

    return {
      stop,
      isActive: () => active,
    };
  }

  clearLoop() {
    for (const id of this.timers) clearTimeout(id);
    this.timers.clear();
  }
}
