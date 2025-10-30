import type { Entity, EntityClass } from "./entities/Entity";

export type Cell = {
  x: number;
  y: number;
  entities: Entity[];
};

export class GardenMap {
  cells: Cell[][] = [];

  constructor(public width: number, public height: number) {
    this.createMap();
  }

  createMap() {
    for (let y = 0; y < this.height; y++) {
      this.cells.push([]);

      for (let x = 0; x < this.width; x++) {
        this.cells[y].push({ x, y, entities: [] });
      }
    }
  }

  placeEntity(entity: Entity) {
    const { x, y } = entity;

    this.cells[y][x] = {
      x,
      y,
      entities: [...this.cells[y][x].entities, entity],
    };
  }

  removeEntity(entity: Entity) {
    const { x, y } = entity;

    this.cells[y][x].entities = this.cells[y][x].entities.filter(
      (entityToFilter) => entityToFilter.id !== entity.id
    );
  }

  removeAllEntities() {
    this.cells = [];

    this.createMap();
  }

  getCellEntities<T extends Entity>(x: number, y: number) {
    const entities = this.cells[y][x]?.entities || [];

    return entities as T[];
  }

  getRowEntitiesFrom(x: number, y: number) {
    const resultEntities = [];

    for (const cell of this.cells[y]) {
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

    for (const innerCells of this.cells) {
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
