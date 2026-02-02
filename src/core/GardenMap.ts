import type { Entity, EntityClass } from "./entities/Entity";

export type Cell = {
  x: number;
  y: number;
  entities: Entity[];
};

export class GardenMap {
  private _cells: Cell[][] = [];

  constructor(public width: number, public height: number) {
    this.createMap();
  }

  get cells() {
    return this._cells;
  }

  private createMap() {
    for (let y = 0; y < this.height; y++) {
      this._cells.push([]);

      for (let x = 0; x < this.width; x++) {
        this._cells[y].push({ x, y, entities: [] });
      }
    }
  }

  placeEntity(entity: Entity) {
    const { x, y } = entity;

    entity.isPlacedOnMap = true;

    this._cells[y][x] = {
      x,
      y,
      entities: [...this._cells[y][x].entities, entity],
    };
  }

  removeEntity(entity: Entity) {
    const { x, y } = entity;

    this._cells[y][x].entities = this._cells[y][x].entities.filter(
      (entityToFilter) => {
        if (entityToFilter.id !== entity.id) {
          entity.isPlacedOnMap = false;

          return true;
        }

        return false;
      }
    );
  }

  removeAllEntities() {
    this._cells = this._cells.map((rows) =>
      rows.map((cell) => {
        cell.entities.forEach((e) => {
          e.isPlacedOnMap = false;
        });
        return cell;
      })
    );

    this._cells = [];

    this.createMap();
  }

  getCellEntities<T extends Entity>(x: number, y: number) {
    const entities = this._cells[y][x]?.entities || [];

    return entities as T[];
  }

  getRowEntitiesFrom(x: number, y: number) {
    const resultEntities = [];

    for (const cell of this._cells[y]) {
      if (cell.x >= x) {
        for (const entity of cell.entities) {
          if (entity) {
            resultEntities.push(entity);
          }
        }
      }
    }

    return resultEntities;
  }

  getEntities<T extends Entity>(EntityInstances: EntityClass<T>[]) {
    const resultEntities: T[] = [];

    for (const innerCells of this._cells) {
      for (const cell of innerCells) {
        const { entities } = cell;

        for (const entity of entities) {
          for (const EntityInstance of EntityInstances) {
            if (entity && EntityInstance && entity instanceof EntityInstance) {
              resultEntities.push(entity);
            }
          }
        }
      }
    }

    return resultEntities;
  }
}
