import { GameLoop } from "./engine/GameLoop";
import { getRandom, Spawner } from "./engine/Spawner";
import type { MovingEntity } from "./entities/MovingEntity";
import type { Wave } from "./FlagWaveGenerator";

const INITIAL_COOLDOWN = 15000;

export class WaveEntitySpawner extends Spawner {
  waveLoop: GameLoop = new GameLoop(INITIAL_COOLDOWN);

  private waveCount = 0;
  private flagCount = 0;

  gameCompletion = 0;

  constructor(private flags: Wave[][]) {
    super();
  }

  performWaveSpawn(spawn: (entity: MovingEntity) => void) {
    let completedWaves = 0;
    let totalFlagWaves = -1;

    let totalWaves = 0;

    for (let i = 0; i < this.flags.length; i++) {
      totalWaves += this.flags[i].length;
    }

    this.waveLoop.loop(() => {
      const isLastWave = this.waveCount === totalFlagWaves;

      if (isLastWave) {
        this.flagCount++;

        this.waveCount = 0;
      }

      const isLastFlag = this.flagCount === this.flags.length;

      if (isLastFlag) {
        this.waveLoop.stopAll();

        return true;
      }

      const waves = this.flags[this.flagCount];
      const { cooldown, entities, interval, count } = waves[this.waveCount];

      totalFlagWaves = this.flags[this.flagCount].length;

      this.waveCount++;

      completedWaves++;

      this.gameCompletion = (completedWaves / totalWaves) * 100;

      let entitySpawnCount = 0;

      super.spawnLoop(
        entities[0].Entity,
        { min: 8, max: 8 },
        { min: 0, max: 4 },
        (zombie) => {
          if (count === entitySpawnCount) return true;

          spawn(zombie);

          entitySpawnCount++;
          return [interval.min, interval.max];
        }
      );

      return getRandom(cooldown.min, cooldown.max);
    });
  }
}
