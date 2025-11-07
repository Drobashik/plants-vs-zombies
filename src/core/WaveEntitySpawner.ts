import { GameLoop } from "./engine/GameLoop";
import { getRandom, Spawner } from "./engine/Spawner";
import type { MovingEntity } from "./entities/MovingEntity";
import type { Wave, WeightEntity } from "./FlagWaveGenerator";

const INITIAL_COOLDOWN = 0;

export class WaveEntitySpawner extends Spawner {
  waveLoop: GameLoop = new GameLoop(INITIAL_COOLDOWN);

  private waveCount = 0;
  private flagCount = 0;

  gameCompletion = 0;

  totalFlags = 0;

  constructor(private flags: Wave[][]) {
    super();

    this.totalFlags = flags.length;
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

      const { cooldown, entities, interval, count } =
        this.flags[this.flagCount][this.waveCount];

      totalFlagWaves = this.flags[this.flagCount].length;

      this.waveCount++;

      completedWaves++;

      this.gameCompletion = (completedWaves / totalWaves) * 100;

      let entitySpawnCount = 0;

      super.spawnLoop(
        { min: 8, max: 8 },
        { min: 0, max: 4 },
        () => this.pickWeighted(entities),
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
