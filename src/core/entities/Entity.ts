export class Entity {
  id = Date.now()

  name = "Entity name";
  image = ''

  speed = 0

  constructor(public x: number, public y: number) {}
}
