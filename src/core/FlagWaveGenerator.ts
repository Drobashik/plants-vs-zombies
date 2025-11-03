import type { EntityClass } from "./entities/Entity";
import type { MovingEntity } from "./entities/MovingEntity";
import type { Zombie } from "./zombies/Zombie";

export type MsRange = { min: number; max: number };

export type WeightEntity<T extends MovingEntity = Zombie> = {
  Entity: EntityClass<T>;
  weight: number;
};

type FlagEntities<T extends MovingEntity = Zombie> = {
  weightEntities: WeightEntity<T>[];
  difficulty?: number;
};

type WaveGeneratorOptions = {
  wavesPerFlag?: number;
  baseCooldown?: MsRange;
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

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clampRange(r: MsRange): MsRange {
  return r.min <= r.max ? r : { min: r.max, max: r.min };
}

export class FlagWaveGenerator {
  flags: Wave[][] = [];

  private readonly wavesPerFlag: number;
  private readonly baseCooldown: MsRange;
  private readonly finalCooldown: MsRange;
  private readonly baseInterval: MsRange;

  constructor(
    private flagWaves: FlagEntities[],
    options: WaveGeneratorOptions = {}
  ) {
    this.wavesPerFlag = options.wavesPerFlag ?? 10;
    this.baseCooldown = clampRange(
      options.baseCooldown ?? { min: 12000, max: 20000 }
    );
    this.finalCooldown = clampRange(
      options.finalCooldown ?? { min: 20000, max: 30000 }
    );
    this.baseInterval = clampRange(
      options.baseInterval ?? { min: 100, max: 2000 }
    );

    this.generateFlags();
  }

  generateFlags() {
    for (const flag of this.flagWaves) {
      const waves: Wave[] = [];

      for (let i = 0; i < this.wavesPerFlag; i++) {
        const waveCount = i + 1;

        const isFinal = waveCount === this.wavesPerFlag;

        const difficulty = flag.difficulty ?? 1.0;

        let count = (isFinal ? 10 : waveCount >= 6 ? 5 : 3) * difficulty;

        const randomCount = Math.round(count + randInt(-1, 0));

        count = isFinal ? Math.max(8, randomCount) : Math.max(1, randomCount);
        count = Math.min(15, count);

        const cooldown = isFinal ? this.finalCooldown : this.baseCooldown;

        waves.push({
          cooldown,
          count,
          entities: flag.weightEntities,
          interval: this.baseInterval,
        });
      }

      this.flags.push(waves);
    }
  }
}
