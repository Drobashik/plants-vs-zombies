import type { Entity } from "./entities/Entity";

type Cell = {
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
    for (let y = 0; y < this.width; y++) {
      this.cells.push([]);

      for (let x = 0; x < this.height; x++) {
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

  getEntities<T extends Entity>(
    EntityInstance?: new (x: number, y: number) => T
  ) {
    const resultEntities: T[] = [];

    for (const innerCells of this.cells) {
      for (const cell of innerCells) {
        const { entities } = cell;

        for (const entity of entities) {
          if (entity && EntityInstance && entity instanceof EntityInstance) {
            resultEntities.push(entity);
          }
        }
      }
    }

    return resultEntities;
  }
}
