import type { EntityClass } from "../entities/Entity";
import type { MovingEntity } from "../entities/MovingEntity";
import type { Zombie } from "../zombies/Zombie";

export type MsRange = { min: number; max: number };

export type WeightEntity<T extends MovingEntity = MovingEntity> = {
  Entity: EntityClass<T>;
  weight: number;
};

type FlagEntities<T extends MovingEntity = Zombie> = {
  weightEntities: WeightEntity<T>[];
  difficulty?: number;
};

type WaveGeneratorOptions = {
  wavesPerFlag?: number;
  startCooldown?: MsRange;
  baseCooldown?: MsRange
  finalCooldown?: MsRange;
  baseInterval?: MsRange;
};

export type Wave = {
  count: number;
  cooldown: MsRange;
  interval: MsRange;
  entities: WeightEntity[];
  tag?: "final" | "normal";
};

const MIN_ENTITY_COUNT = 1;
const BASE_ENTITY_COUNT = 5;
const HIGH_ENTITY_COUNT = 9;
const HIGHEST_ENTITY_COUNT = 12;
const MAX_ENTITY_COUNT = 20;

const FLAG_FINAL_COOLDOWN = { min: 1000, max: 1000 };

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clampRange(r: MsRange): MsRange {
  return r.min <= r.max ? r : { min: r.max, max: r.min };
}

export class FlagWaveGenerator {
  readonly flags: Wave[][] = [];

  private readonly wavesPerFlag: number;
  private readonly startCooldown: MsRange;
  private readonly baseCooldown: MsRange;
  private readonly finalCooldown: MsRange;
  private readonly baseInterval: MsRange;

  constructor(
    private flagWaves: FlagEntities[],
    options: WaveGeneratorOptions = {}
  ) {
    this.wavesPerFlag = options.wavesPerFlag ?? 10;

    this.startCooldown = clampRange(
      options.baseCooldown ?? { min: 15000, max: 30000 }
    );
    this.baseCooldown = clampRange(
      options.baseCooldown ?? { min: 15000, max: 20000 }
    );
    this.finalCooldown = clampRange(
      options.finalCooldown ?? { min: 30000, max: 40000 }
    );
    this.baseInterval = clampRange(
      options.baseInterval ?? { min: 100, max: 3600 }
    );

    this.generateFlags();
  }

  private calculateCount(
    waveCount: number,
    flagCount: number,
    difficulty: number
  ) {
    let count = BASE_ENTITY_COUNT;

    const isFinal = waveCount === this.wavesPerFlag;

    if (waveCount <= 2 && flagCount === 0) count = MIN_ENTITY_COUNT;

    if (waveCount >= 6) count = HIGH_ENTITY_COUNT;

    if (isFinal) count = HIGHEST_ENTITY_COUNT;

    count *= difficulty;

    const randomCount = Math.round(count + randInt(-1, 0));

    count = isFinal ? Math.max(8, randomCount) : Math.max(1, randomCount);
    count = Math.min(MAX_ENTITY_COUNT, count);

    return count;
  }

  private calculateCooldown(waveCount: number, flagCount: number) {
    const isPreFinalWave = waveCount === this.wavesPerFlag - 1;
    const isFinalWave = waveCount === this.wavesPerFlag;
    const isFinalFlag = flagCount === this.flagWaves.length - 1;

    let cooldown = isPreFinalWave ? this.finalCooldown : this.baseCooldown;

    cooldown =
      waveCount <= 4 && flagCount === 0 ? this.startCooldown : cooldown;

    cooldown = isFinalWave && isFinalFlag ? FLAG_FINAL_COOLDOWN : cooldown;

    return cooldown;
  }

  private generateFlags() {
    for (let flagCount = 0; flagCount < this.flagWaves.length; flagCount++) {
      const waves: Wave[] = [];
      const flag = this.flagWaves[flagCount];

      for (let waveCount = 1; waveCount <= this.wavesPerFlag; waveCount++) {
        const count = this.calculateCount(
          waveCount,
          flagCount,
          flag.difficulty ?? 1.0
        );

        const cooldown = this.calculateCooldown(waveCount, flagCount);

        const easyEntities = flag.weightEntities.filter((entity) => {
          const maxWeight = Math.max(
            ...flag.weightEntities.map((entity) => entity.weight)
          );

          return entity.weight >= maxWeight;
        });

        waves.push({
          cooldown,
          count,
          entities:
            flagCount === 0 && waveCount <= 3
              ? easyEntities
              : flag.weightEntities,
          interval: this.baseInterval,
        });
      }

      this.flags.push(waves);
    }
  }
}
