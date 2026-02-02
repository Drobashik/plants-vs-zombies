export class Random {
  constructor(private historySize = 2) {
    if (historySize < 0) throw new Error("historySize should be >= 0");
  }

  private histories = new Map<string, number[]>();

  next(min: number, max: number): number {
    if (max < min) throw new Error("max should be >= min");

    const key = `${min}:${max}`;
    const recentValues = this.histories.get(key) ?? [];
    const rangeSize = max - min + 1;

    let value = Math.floor(Math.random() * rangeSize) + min;
    let attempts = 0;

    while (
      recentValues.includes(value) &&
      recentValues.length < rangeSize &&
      attempts++ < 20
    ) {
      value = Math.floor(Math.random() * rangeSize) + min;
    }

    recentValues.push(value);

    if (recentValues.length > this.historySize) recentValues.shift();

    this.histories.set(key, recentValues);

    return value;
  }
}
