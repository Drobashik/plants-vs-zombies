import { INITIAL_BUDGET } from "../constants";

export class Budget {
  private _budget = 0;

  constructor(private initialBudget = INITIAL_BUDGET) {
    this._budget = this.initialBudget;
  }

  get value() {
    return this._budget;
  }

  increaseBudget(value: number) {
    this._budget += value;
  }

  decreaseBudget(value: number) {
    this._budget -= value;
  }
}
