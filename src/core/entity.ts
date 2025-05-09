import { Scene } from './scene'
import { Renderer } from '../render/renderer'
import { Component } from './component'

export class Entity {
  private id: string
  private components: Map<string, Component> = new Map()
  private scene: Scene | null = null
  private active: boolean = true
  private visible: boolean = true

  constructor(id: string) {
    this.id = id
  }

  public getId(): string {
    return this.id
  }

  public getScene(): Scene | null {
    return this.scene
  }

  public isActive(): boolean {
    return this.active
  }

  public setActive(active: boolean): void {
    this.active = active
  }

  public isVisible(): boolean {
    return this.visible
  }

  public setVisible(visible: boolean): void {
    this.visible = visible
  }

  public addComponent<T extends Component>(component: T): T {
    const type = component.constructor.name
    if (this.components.has(type)) {
      throw new Error(`Component of type ${type} already exists on entity ${this.id}`)
    }
    this.components.set(type, component)
    component.onAddedToEntity(this)
    return component
  }

  public removeComponent<T extends Component>(component: T): void {
    const type = component.constructor.name
    if (this.components.delete(type)) {
      component.onRemovedFromEntity()
    }
  }

  public getComponent<T extends Component>(type: new (...args: any[]) => T): T | undefined {
    return this.components.get(type.name) as T | undefined
  }

  public hasComponent<T extends Component>(type: new (...args: any[]) => T): boolean {
    return this.components.has(type.name)
  }

  public update(deltaTime: number): void {
    if (!this.active) return

    for (const component of this.components.values()) {
      component.update(deltaTime)
    }
  }

  public render(renderer: Renderer): void {
    if (!this.active || !this.visible) return

    for (const component of this.components.values()) {
      component.render(renderer)
    }
  }

  public onAdded(scene: Scene): void {
    this.scene = scene
  }

  public onRemoved(): void {
    this.scene = null
  }

  public getComponents(): Map<string, Component> {
    return this.components
  }
}
