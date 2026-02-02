import { GameLoop } from "./GameLoop";
import { Spawner } from "./Spawner";
import type { MovingEntity } from "../entities/MovingEntity";
import type { Wave, WeightEntity } from "./FlagWaveGenerator";
import { FINAL_COOLDOWN, INITIAL_ENTITY_COOLDOWN } from "../../constants";
import type { GameLyfecycle } from "./EntityController";
import { Random } from "../utils/Random";

export class WaveEntitySpawner extends Spawner {
  private _waveLoop: GameLoop = new GameLoop(INITIAL_ENTITY_COOLDOWN);

  private waveCount = 0;

  private flagCount = 0;

  private _gameCompletion = 0;

  private _totalFlags = 0;

  constructor(
    private flags: Wave[][],
    private gameLifecycle: Partial<GameLyfecycle>
  ) {
    super();

    this._totalFlags = flags.length;
  }

  get waveLoop() {
    return this._waveLoop;
  }

  get totalFlags() {
    return this._totalFlags;
  }

  get gameCompletion() {
    return this._gameCompletion;
  }

  private pickWeighted(entities: WeightEntity[]) {
    const total = entities.reduce((s, a) => s + Math.max(0, a.weight), 0);

    if (total <= 0) return entities[0].Entity;

    let x = Math.random() * total;

    for (const entity of entities) {
      x -= Math.max(0, entity.weight);

      if (x <= 0) return entity.Entity;
    }

    return entities[entities.length - 1].Entity;
  }

  private restoreAll() {
    this._gameCompletion = 0;
    this.flagCount = 0;
    this.waveCount = 0;
  }

  performWaveSpawn(spawn: (entity: MovingEntity) => void) {
    this.restoreAll();

    let completedWaves = 0;
    let totalFlagWaves = -1;

    let totalWaves = 0;
    let isNormalWave = true;

    const random = new Random();

    for (let i = 0; i < this.flags.length; i++) {
      totalWaves += this.flags[i].length;
    }

    this._waveLoop.loop(() => {
      const isLastWave = this.waveCount === totalFlagWaves;

      if (isLastWave) {
        this.flagCount++;

        this.waveCount = 0;
      }

      const isLastFlag = this.flagCount === this.flags.length;

      if (this.waveCount === totalFlagWaves - 1 && isNormalWave) {
        const shouldBreak = this.gameLifecycle.onGameChange?.() ?? false;

        if (shouldBreak) {
          isNormalWave = false;
        }

        return FINAL_COOLDOWN;
      }

      if (isLastFlag) {
        const isGameStopped = this.gameLifecycle.onGameOver?.();

        return isGameStopped ?? FINAL_COOLDOWN;
      }

      isNormalWave = true;

      const { cooldown, entities, interval, count } =
        this.flags[this.flagCount][this.waveCount];

      totalFlagWaves = this.flags[this.flagCount].length;

      this.waveCount++;

      completedWaves++;

      this._gameCompletion = (completedWaves / totalWaves) * 100;

      let entitySpawnCount = 0;

      const { min, max } = interval;

      super.spawnLoop(
        () => new (this.pickWeighted(entities))(8, random.next(0, 4)),
        (entity) => ({
          type: "instant",
          delaying: () => [{ min, max }],
          spawn: () => {
            if (count === entitySpawnCount) return "stop";

            spawn(entity);

            entitySpawnCount++;

            return "continue";
          },
        })
      );

      return random.next(cooldown.min, cooldown.max);
    });
  }
}
