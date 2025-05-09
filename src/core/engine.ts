import { EventEmitter } from './event-emitter.js'
import { Scene } from './scene.js'
import { Renderer } from '../render/renderer.js'
import { InputManager } from './input-manager.js'

/**
 * Main game engine class that manages the game loop and all subsystems
 */
export interface EngineConfig {
  targetFPS: number
  width: number
  height: number
  backgroundColor: string
  isMobile?: boolean
}

export class GameEngine extends EventEmitter {
  private config: EngineConfig
  private currentScene: Scene | null = null
  private isRunning: boolean = false
  private lastFrameTime: number = 0
  private frameCount: number = 0
  private fps: number = 0
  private renderer: Renderer
  private inputManager: InputManager

  constructor(config: EngineConfig) {
    super()
    this.config = config
    this.renderer = new Renderer(config)
    this.inputManager = new InputManager({ isMobile: config.isMobile })
  }

  /**
   * Initialize the game engine with configuration
   */
  public initialize(): void {
    this.renderer.initialize()
    this.inputManager.initialize()
    this.emit('initialized')
  }

  /**
   * Start the game loop
   */
  public start(): void {
    if (this.isRunning) return

    this.isRunning = true
    this.lastFrameTime = performance.now()
    this.frameCount = 0
    this.fps = 0

    this.gameLoop()
    this.emit('started')
  }

  /**
   * Stop the game loop
   */
  public stop(): void {
    this.isRunning = false
    this.emit('stopped')
  }

  /**
   * Set the current scene
   */
  public setScene(scene: Scene): void {
    if (this.currentScene) {
      this.currentScene.onExit()
    }

    this.currentScene = scene
    this.currentScene.setEngine(this)
    this.currentScene.onEnter()
    this.emit('sceneChanged', scene)
  }

  /**
   * Get the current scene
   */
  public getCurrentScene(): Scene | null {
    return this.currentScene
  }

  /**
   * Get the current FPS
   */
  public getFPS(): number {
    return this.fps
  }

  /**
   * Main game loop
   */
  private gameLoop(): void {
    if (!this.isRunning) return

    const currentTime = performance.now()
    const deltaTime = (currentTime - this.lastFrameTime) / 1000
    this.lastFrameTime = currentTime

    // Update FPS counter
    this.frameCount++
    if (currentTime - this.lastFrameTime >= 1000) {
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastFrameTime = currentTime
    }

    // Update and render current scene
    if (this.currentScene) {
      this.currentScene.update(deltaTime)
      this.renderer.clear()
      this.currentScene.render(this.renderer)
    }

    // Schedule next frame
    requestAnimationFrame(() => this.gameLoop())
  }

  // Getters for subsystems
  public getRenderer(): Renderer {
    return this.renderer
  }

  public getInputManager(): InputManager {
    return this.inputManager
  }

  // Future systems - to be implemented later
  /*
  public getPhysics(): PhysicsEngine {
    return this.physics
  }

  public getAudio(): AudioManager {
    return this.audio
  }

  public getAssets(): AssetManager {
    return this.assets
  }

  public getNetwork(): NetworkManager {
    return this.network
  }
  */

  public isMobileDevice(): boolean {
    return this.config.isMobile || false
  }
}

/*
export interface GameConfig {
  targetFPS?: number
  assets: AssetConfig
  renderer: RendererConfig
  physics: PhysicsConfig
  audio: AudioConfig
  network: NetworkConfig
  input: InputConfig
}
*/
