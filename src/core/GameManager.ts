import { SunBehavior } from "./behaviors/SunBehavior";
import { EntityController } from "./engine/EntityController";
import { type Wave } from "./engine/FlagWaveGenerator";
import type { GameLoop } from "./engine/GameLoop";
import { WaveEntitySpawner } from "./engine/WaveEntitySpawner";
import { GardenMap } from "./GardenMap";
import { Zombie } from "./zombies/Zombie";

export type GameState = "idle" | "play" | "pause" | "win" | "lose";

export class GameManager {
  readonly controller: EntityController;

  readonly waveSpawner: WaveEntitySpawner;

  private readonly gameLoops: GameLoop[] = [];

  private _gameState: GameState = "idle";

  private render: () => void;

  constructor(private _garden: GardenMap, private levelWaves: Wave[][]) {
    this.waveSpawner = new WaveEntitySpawner(this.levelWaves, {
      onGameChange: () => {
        const zombies = this._garden.getEntities([Zombie]);

        if (!zombies.length) {
          return true;
        }

        return false;
      },
      onGameOver: () => {
        this.winGame();
      },
    });

    this.controller = new EntityController(this._garden, {
      onGameState: () => ({
        state: this._gameState,
        isGameEnd: this._gameState === "win" || this._gameState === "lose",
      }),
      onTick: () => {
        this.render();
      },
      onGameOver: () => {
        this.loseGame();
      },
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
    this._gameState = "pause";

    for (const loop of this.gameLoops) loop.pauseAll();
  }

  private resumeGame() {
    this._gameState = "play";

    for (const loop of this.gameLoops) loop.resumeAll();
  }

  setRenderFn(renderFn?: () => void) {
    const emtpyFn = () => {};

    this.render = renderFn || emtpyFn;
  }

  private loseGame() {
    this._gameState = "lose";

    this.stopGame();
  }

  private winGame() {
    const zombies = this._garden.getEntities([Zombie]);

    if (!zombies.length) {
      this._gameState = "win";

      return true;
    }
  }

  private restartGame() {
    this._gameState = "idle";

    this._garden.removeAllEntities();

    this.startGame();
  }

  private startGame() {
    this._gameState = "play";

    this.waveSpawner.performWaveSpawn((zombie) => {
      zombie.behavior.start(this.controller, zombie);
    });

    SunBehavior.startAmbientSpawn(this.controller);

    this.render();
  }

  executeGameAction() {
    switch (this._gameState) {
      case "idle":
        this.startGame();
        break;
      case "pause":
        this.resumeGame();
        break;
      case "play":
        this.pauseGame();
        break;
      default:
        this.restartGame();
    }

    this.render();
  }
}
