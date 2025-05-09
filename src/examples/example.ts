/**
 * ******************************************************************
 * *            MAIN GAME FILE - EDIT THIS BASED ON PROMPTS          *
 * ******************************************************************
 *
 * This file contains the example game implementation.
 * When modifying the game based on prompts, this is the primary file to edit.
 *
 * - Keep the core imports and structure
 * - Modify game components to change behavior
 * - Add new components for new functionality
 * - The main game setup is at the bottom of this file
 *
 * See AI_GUIDE.md in the root directory for complete documentation.
 */

import { GameEngine } from '../core/engine'
import { Scene } from '../core/scene'
import { Entity } from '../core/entity'
import { Component } from '../core/component'
import { Renderer } from '../render/renderer'

// Particle class for visual effects
class Particle {
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  life: number
  maxLife: number

  constructor(x: number, y: number, color: string) {
    this.x = x
    this.y = y
    this.size = Math.random() * 10 + 5 // 5-15
    this.color = color
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 200 + 50
    this.speedX = Math.cos(angle) * speed
    this.speedY = Math.sin(angle) * speed
    this.maxLife = Math.random() * 1 + 0.5 // 0.5-1.5 seconds
    this.life = this.maxLife
  }

  update(deltaTime: number): boolean {
    this.x += this.speedX * deltaTime
    this.y += this.speedY * deltaTime
    this.life -= deltaTime
    this.size = Math.max(0, this.size * (this.life / this.maxLife))
    return this.life > 0
  }

  render(renderer: Renderer): void {
    // Fade out as life decreases
    const alpha = this.life / this.maxLife
    const color = this.color.startsWith('#') ?
      this.color :
      `rgba(255,255,255,${alpha})`

    renderer.drawCircle(this.x, this.y, this.size, color)
  }
}

// Particle emitter component
class ParticleEmitterComponent extends Component {
  private particles: Particle[] = []
  private colors: string[] = [
    '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff'
  ]

  emit(x: number, y: number, count: number = 20): void {
    for (let i = 0; i < count; i++) {
      const color = this.colors[Math.floor(Math.random() * this.colors.length)]
      this.particles.push(new Particle(x, y, color))
    }

    // Add debug message to console to verify emission
    console.log(`Emitted ${count} particles at (${x}, ${y})`)
  }

  update(deltaTime: number): void {
    // Update particles and remove dead ones
    this.particles = this.particles.filter(p => p.update(deltaTime))
  }

  render(renderer: Renderer): void {
    // Render all particles
    this.particles.forEach(p => p.render(renderer))
  }
}

// Demo ball component that bounces around the screen
class BouncingBallComponent extends Component {
  private x: number = 0
  private y: number = 0
  private radius: number = 20
  private speedX: number = 200
  private speedY: number = 200
  private color: string = '#ff0000'
  private colors: string[] = [
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ff8000', // Orange
    '#8000ff'  // Purple
  ]
  private currentColorIndex: number = 0
  private particleEmitter: ParticleEmitterComponent | null = null

  constructor(x: number, y: number) {
    super()
    this.x = x
    this.y = y
  }

  public onAddedToEntity(entity: Entity): void {
    super.onAddedToEntity(entity)

    // Get reference to the particle emitter
    if (entity.getScene()) {
      const emitterEntity = entity.getScene()?.getEntities().values().next().value
      if (emitterEntity && emitterEntity instanceof Entity) {
        const emitter = emitterEntity.getComponent(ParticleEmitterComponent)
        if (emitter) {
          this.particleEmitter = emitter
        }
      }
    }

    // Register tap listener with debug logging
    const scene = entity.getScene()
    if (scene) {
      const engine = scene.getEngine()
      if (engine) {
        const inputManager = engine.getInputManager()

        // Debug to check if this is being registered
        console.log('Registering tap handler for ball')

        inputManager.onTap(() => {
          console.log('Tap detected!')
          this.changeDirection()

          // Emit particles from the ball's position
          if (this.particleEmitter) {
            this.particleEmitter.emit(this.x, this.y, 30)
          }
        })
      }
    }
  }

  public changeDirection(): void {
    // Reverse both directions and change color
    this.speedX = -this.speedX
    this.speedY = -this.speedY

    // Change to a random color
    this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length
    this.color = this.colors[this.currentColorIndex]

    // Debug log
    console.log(`Ball direction changed: (${this.speedX.toFixed(2)}, ${this.speedY.toFixed(2)})`)
  }

  public update(deltaTime: number): void {
    // Update position
    this.x += this.speedX * deltaTime
    this.y += this.speedY * deltaTime

    // Get renderer for bounds checking
    const renderer = this.entity?.getScene()?.getEngine()?.getRenderer()
    if (!renderer) return

    // Bounce off walls
    if (this.x - this.radius < 0 || this.x + this.radius > renderer.getWidth()) {
      this.speedX *= -1
      this.x = Math.max(this.radius, Math.min(renderer.getWidth() - this.radius, this.x))
    }

    // Bounce off floor and ceiling
    if (this.y - this.radius < 0 || this.y + this.radius > renderer.getHeight()) {
      this.speedY *= -1
      this.y = Math.max(this.radius, Math.min(renderer.getHeight() - this.radius, this.y))
    }
  }

  public render(renderer: Renderer): void {
    renderer.drawCircle(this.x, this.y, this.radius, this.color)
  }

  public getPosition(): {x: number, y: number} {
    return {x: this.x, y: this.y}
  }
}

// Main game scene
class GameScene extends Scene {
  private particleEmitterEntity!: Entity
  private ballEntity!: Entity

  constructor(engine: GameEngine) {
    super('GameScene')
    this.initialize(engine)
  }

  private initialize(engine: GameEngine): void {
    const renderer = engine.getRenderer()

    // Create particle emitter entity
    this.particleEmitterEntity = new Entity('particles')
    this.particleEmitterEntity.addComponent(new ParticleEmitterComponent())
    this.addEntity(this.particleEmitterEntity)

    // Create bouncing ball entity
    this.ballEntity = new Entity('ball')
    this.ballEntity.addComponent(new BouncingBallComponent(
      renderer.getWidth() / 2,
      renderer.getHeight() / 2
    ))
    this.addEntity(this.ballEntity)

    // Add direct tap handler to scene for debugging
    engine.getInputManager().onTap(() => {
      console.log('Scene detected tap')

      // Get ball position
      const ball = this.ballEntity.getComponent(BouncingBallComponent)
      if (ball) {
        const pos = ball.getPosition()

        // Get particle emitter
        const emitter = this.particleEmitterEntity.getComponent(ParticleEmitterComponent)
        if (emitter) {
          emitter.emit(pos.x, pos.y, 30)
        }
      }
    })
  }
}

// Initialize and start the game
window.addEventListener('load', () => {
  // Initialize game engine
  const engine = new GameEngine({
    targetFPS: 60,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#000000',
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  })

  // Handle window resize
  window.addEventListener('resize', () => {
    const renderer = engine.getRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  // Initialize and start the game
  engine.initialize()
  const gameScene = new GameScene(engine)
  engine.setScene(gameScene)
  engine.start()

  // Debug - log when loaded
  console.log('Game initialized and started')

  // Add direct click handler to window
  window.addEventListener('click', (e) => {
    console.log(`Window click detected at (${e.clientX}, ${e.clientY})`)

    // Get reference to the ball and manually change its direction
    const ballEntity = gameScene.getEntityById('ball')
    if (ballEntity) {
      const ball = ballEntity.getComponent(BouncingBallComponent)
      if (ball) {
        console.log('Ball found, changing direction')
        ball.changeDirection()

        // Get particle emitter
        const emitterEntity = gameScene.getEntityById('particles')
        if (emitterEntity) {
          const emitter = emitterEntity.getComponent(ParticleEmitterComponent)
          if (emitter) {
            const pos = ball.getPosition()
            emitter.emit(pos.x, pos.y, 30)
          }
        }
      }
    }
  })
})
