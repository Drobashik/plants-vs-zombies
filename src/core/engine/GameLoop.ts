type TimerId = ReturnType<typeof setTimeout>;

type LoopResult = boolean | number | void;

type LoopFn = () => LoopResult;

interface LoopState {
  id: number;
  render: LoopFn;
  active: boolean;
  paused: boolean;
  timerId?: TimerId;
  nextAt: number;
  remaining: number;
}

export class GameLoop {
  private loops = new Map<number, LoopState>();
  private seq = 1;

  constructor(private gameSpeed: number = 0) {
    this.gameSpeed = Math.max(0, gameSpeed | 0);
  }

  setSpeed(ms: number) {
    this.gameSpeed = Math.max(0, ms | 0);
  }

  loop(renderFn: LoopFn): number {
    const id = this.seq++;
    const state: LoopState = {
      id,
      render: renderFn,
      active: true,
      paused: false,
      nextAt: performance.now() + this.gameSpeed,
      remaining: 0,
    };
    this.loops.set(id, state);
    this.schedule(id);
    return id;
  }

  pause(id: number) {
    const s = this.loops.get(id);
    if (!s || !s.active || s.paused) return;
    s.paused = true;
    if (s.timerId) {
      clearTimeout(s.timerId);
      s.timerId = undefined;
    }
    s.remaining = Math.max(0, s.nextAt - performance.now());
  }

  resume(id: number) {
    const s = this.loops.get(id);
    if (!s || !s.active || !s.paused) return;
    s.paused = false;
    s.nextAt = performance.now() + s.remaining;
    s.remaining = 0;
    this.schedule(id);
  }

  stop(id: number) {
    const s = this.loops.get(id);
    if (!s) return;
    s.active = false;
    s.paused = false;
    if (s.timerId) {
      clearTimeout(s.timerId);
      s.timerId = undefined;
    }
    this.loops.delete(id);
  }

  isActive(id: number) {
    const s = this.loops.get(id);
    return !!s?.active;
  }

  isPaused(id: number) {
    const s = this.loops.get(id);
    return !!s?.paused;
  }

  pauseAll() {
    for (const id of this.loops.keys()) this.pause(id);
  }
  resumeAll() {
    for (const id of this.loops.keys()) this.resume(id);
  }
  stopAll() {
    for (const id of Array.from(this.loops.keys())) this.stop(id);
  }

  private schedule(id: number) {
    const s = this.loops.get(id);
    if (!s || !s.active || s.paused) return;
    const wait = Math.max(0, s.nextAt - performance.now());
    s.timerId = setTimeout(() => this.tick(id), wait);
  }

  private tick(id: number) {
    const s = this.loops.get(id);
    if (!s || !s.active || s.paused) return;

    const res = s.render();

    if (res === true) {
      this.stop(id);
      return;
    }

    const nextDelay =
      typeof res === "number" ? Math.max(0, res | 0) : this.gameSpeed;

    s.nextAt += nextDelay;
    this.schedule(id);
  }
}
