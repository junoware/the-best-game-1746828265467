import { Entity } from './entity.js'
import { Scene } from './scene.js'
import { Component } from './component.js'

export abstract class System {
  protected scene: Scene | null = null

  constructor() {}

  public onAddedToScene(scene: Scene): void {
    this.scene = scene
  }

  public onRemovedFromScene(): void {
    this.scene = null
  }

  public onSceneEnter(): void {
    // Override in subclasses
  }

  public onSceneExit(): void {
    // Override in subclasses
  }

  public abstract update(deltaTime: number, entities: Entity[]): void

  protected getScene(): Scene | null {
    return this.scene
  }

  protected hasRequiredComponents(
    entity: Entity,
    componentTypes: (new (...args: any[]) => Component)[]
  ): boolean {
    return componentTypes.every((componentType) =>
      entity.hasComponent(componentType)
    )
  }
}
