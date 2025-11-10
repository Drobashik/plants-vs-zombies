import { SunBehavior } from "./behaviors/SunBehavior";
import { EntityController } from "./engine/EntityController";
import { FlagWaveGenerator } from "./engine/FlagWaveGenerator";
import type { GameLoop } from "./engine/GameLoop";
import { WaveEntitySpawner } from "./engine/WaveEntitySpawner";
import { GardenMap } from "./GardenMap";

export type GameState = "idle" | "play" | "pause" | "win" | "lose";

export class GameManager {
  readonly controller: EntityController;

  readonly waveSpawner: WaveEntitySpawner;

  private readonly gameLoops: GameLoop[] = [];

  private _gameState: GameState = "idle";

  private render: () => void;

  constructor(
    private _garden: GardenMap,
    private flagsGenerator: FlagWaveGenerator
  ) {
    this.waveSpawner = new WaveEntitySpawner(this.flagsGenerator.flags);

    this.controller = new EntityController(this._garden, {
      getGameState: () => this._gameState,
      onTick: () => {
        this.render();
      },
      onGameOver: () => {},
    });

    this.gameLoops.push(
      this.controller.spawner.spawnerLoop,
      this.controller.moveLoop,
      this.waveSpawner.waveLoop
    );
  }

  get garden() {
    return this._garden;
  }

  get gameState() {
    return this._gameState;
  }

  private stopGame() {
    for (const loop of this.gameLoops) loop.stopAll();
  }

  private pauseGame() {
    for (const loop of this.gameLoops) loop.pauseAll();

    this._gameState = "pause";
  }

  private resumeGame() {
    for (const loop of this.gameLoops) loop.resumeAll();

    this._gameState = "play";
  }

  setRenderFn(renderFn?: () => void) {
    const emtpyFn = () => {};

    this.render = renderFn || emtpyFn;
  }

  restartGame() {
    this._gameState = "idle";

    this._garden.removeAllEntities();

    this.startGame();
  }

  startGame() {
    this.waveSpawner.performWaveSpawn((zombie) => {
      zombie.behavior.start(this.controller, zombie);
    });

    SunBehavior.startAmbientSpawn(this.controller);

    this._gameState = "play";

    this.render();
  }

  endGame(outcome: "win" | "lose") {
    this._gameState = outcome;

    this.stopGame();

    this.render();
  }

  resumeOrPauseGame() {
    switch (this._gameState) {
      case "pause":
        this.resumeGame();
        break;
      case "play":
        this.pauseGame();
        break;
      case "lose":
        this.restartGame();
        break;
    }

    this.render();
  }
}
