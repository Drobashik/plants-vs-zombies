import type { Entity } from "./Entity";

type Cell = {
  x: number;
  y: number;
  entity: Entity | null;
};

export class GardenMap {
  cells: Cell[][] = [];

  constructor(private width: number, private height: number) {
    this.createMap();
  }

  createMap() {
    for (let y = 0; y < this.width; y++) {
      this.cells.push([]);

      for (let x = 0; x < this.height; x++) {
        this.cells[y].push({ x, y, entity: null });
      }
    }
  }

  placeEntity(entity: Entity) {
    const { x, y } = entity;

    this.cells[y][x] = { x, y, entity };
  }

  removeEntity(entity: Entity) {
    const { x, y } = entity;

    this.cells[y][x].entity = null;
  }

  getEntities<T extends Entity>(
    EntityInstance?: new (x: number, y: number) => T
  ) {
    const entities = [];

    for (const innerCells of this.cells) {
      for (const cell of innerCells) {
        if (
          cell.entity &&
          EntityInstance &&
          cell.entity instanceof EntityInstance
        ) {
          entities.push(cell.entity);
        }
      }
    }

    return entities;
  }
}
