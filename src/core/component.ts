import { Entity } from './entity.js'
import { Scene } from './scene.js'
import { Renderer } from '../render/renderer'

export abstract class Component {
  protected entity: Entity | null = null

  constructor() {}

  public onAddedToEntity(entity: Entity): void {
    this.entity = entity
  }

  public onRemovedFromEntity(): void {
    this.entity = null
  }

  public onEntityAddedToScene(_scene: Scene): void {
    // Override in derived classes if needed
  }

  public onEntityRemovedFromScene(): void {
    // Override in derived classes if needed
  }

  public setEntity(entity: Entity | null): void {
    this.entity = entity
  }

  public getEntity(): Entity | null {
    return this.entity
  }

  public update(_deltaTime: number): void {
    // Override in subclasses
  }

  public render(_renderer: Renderer): void {
    // Override in subclasses
  }
}
