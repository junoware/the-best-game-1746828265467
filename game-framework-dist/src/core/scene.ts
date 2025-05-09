import { Entity } from './entity'
import { Renderer } from '../render/renderer'
import { GameEngine } from './engine'

export class Scene {
  private entities: Set<Entity>
  private name: string
  private engine: GameEngine | null

  constructor(name: string) {
    this.name = name
    this.entities = new Set()
    this.engine = null
  }

  public getName(): string {
    return this.name
  }

  public getEngine(): GameEngine | null {
    return this.engine
  }

  public setEngine(engine: GameEngine): void {
    this.engine = engine
  }

  public addEntity(entity: Entity): void {
    this.entities.add(entity)
    entity.onAdded(this)
  }

  public removeEntity(entity: Entity): void {
    if (this.entities.delete(entity)) {
      entity.onRemoved()
    }
  }

  public getEntities(): Set<Entity> {
    return this.entities
  }

  public getEntityById(id: string): Entity | null {
    for (const entity of this.entities) {
      if (entity.getId() === id) {
        return entity
      }
    }
    return null
  }

  public update(deltaTime: number): void {
    for (const entity of this.entities) {
      entity.update(deltaTime)
    }
  }

  public render(renderer: Renderer): void {
    for (const entity of this.entities) {
      entity.render(renderer)
    }
  }

  public onEnter(): void {
    // Override in derived classes
  }

  public onExit(): void {
    // Override in derived classes
  }

  public clear(): void {
    this.entities.clear()
  }
}
