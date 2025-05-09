export interface PhysicsConfig {
  gravity?: { x: number; y: number }
  timeScale?: number
  maxSteps?: number
}

export interface PhysicsBody {
  position: { x: number; y: number }
  velocity: { x: number; y: number }
  acceleration: { x: number; y: number }
  mass: number
  restitution: number
  friction: number
  isStatic: boolean
  bounds: { width: number; height: number }
}

export class PhysicsEngine {
  private gravity: { x: number; y: number } = { x: 0, y: 9.81 }
  private timeScale: number = 1.0
  private maxSteps: number = 3
  private bodies: Set<PhysicsBody> = new Set()
  private fixedTimeStep: number = 1 / 60

  public async initialize(config: PhysicsConfig): Promise<void> {
    this.gravity = config.gravity ?? this.gravity
    this.timeScale = config.timeScale ?? 1.0
    this.maxSteps = config.maxSteps ?? 3
  }

  public addBody(body: PhysicsBody): void {
    this.bodies.add(body)
  }

  public removeBody(body: PhysicsBody): void {
    this.bodies.delete(body)
  }

  public update(deltaTime: number): void {
    const scaledDeltaTime = deltaTime * this.timeScale
    const steps = Math.min(
      this.maxSteps,
      Math.ceil(scaledDeltaTime / this.fixedTimeStep),
    )

    for (let i = 0; i < steps; i++) {
      this.step(this.fixedTimeStep)
    }
  }

  private step(deltaTime: number): void {
    // Update velocities and positions
    for (const body of this.bodies) {
      if (body.isStatic) continue

      // Apply gravity
      body.acceleration.x += this.gravity.x
      body.acceleration.y += this.gravity.y

      // Update velocity
      body.velocity.x += body.acceleration.x * deltaTime
      body.velocity.y += body.acceleration.y * deltaTime

      // Update position
      body.position.x += body.velocity.x * deltaTime
      body.position.y += body.velocity.y * deltaTime

      // Reset acceleration
      body.acceleration.x = 0
      body.acceleration.y = 0
    }

    // Check and resolve collisions
    this.checkCollisions()
  }

  private checkCollisions(): void {
    const bodies = Array.from(this.bodies)

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const bodyA = bodies[i]
        const bodyB = bodies[j]

        if (this.isColliding(bodyA, bodyB)) {
          this.resolveCollision(bodyA, bodyB)
        }
      }
    }
  }

  private isColliding(bodyA: PhysicsBody, bodyB: PhysicsBody): boolean {
    const aLeft = bodyA.position.x
    const aRight = bodyA.position.x + bodyA.bounds.width
    const aTop = bodyA.position.y
    const aBottom = bodyA.position.y + bodyA.bounds.height

    const bLeft = bodyB.position.x
    const bRight = bodyB.position.x + bodyB.bounds.width
    const bTop = bodyB.position.y
    const bBottom = bodyB.position.y + bodyB.bounds.height

    return !(
      aRight < bLeft ||
      aLeft > bRight ||
      aBottom < bTop ||
      aTop > bBottom
    )
  }

  private resolveCollision(bodyA: PhysicsBody, bodyB: PhysicsBody): void {
    if (bodyA.isStatic && bodyB.isStatic) return

    // Calculate collision normal
    const dx =
      bodyB.position.x +
      bodyB.bounds.width / 2 -
      (bodyA.position.x + bodyA.bounds.width / 2)
    const dy =
      bodyB.position.y +
      bodyB.bounds.height / 2 -
      (bodyA.position.y + bodyA.bounds.height / 2)
    const length = Math.sqrt(dx * dx + dy * dy)
    const nx = dx / length
    const ny = dy / length

    // Calculate relative velocity
    const relativeVelocityX = bodyB.velocity.x - bodyA.velocity.x
    const relativeVelocityY = bodyB.velocity.y - bodyA.velocity.y
    const relativeVelocity = relativeVelocityX * nx + relativeVelocityY * ny

    // If objects are moving apart, no need to resolve
    if (relativeVelocity > 0) return

    // Calculate restitution (bounciness)
    const restitution = Math.min(bodyA.restitution, bodyB.restitution)

    // Calculate impulse
    let impulse = -(1 + restitution) * relativeVelocity
    if (!bodyA.isStatic && !bodyB.isStatic) {
      impulse /= 2
    }

    // Apply impulse
    if (!bodyA.isStatic) {
      bodyA.velocity.x -= impulse * nx
      bodyA.velocity.y -= impulse * ny
    }
    if (!bodyB.isStatic) {
      bodyB.velocity.x += impulse * nx
      bodyB.velocity.y += impulse * ny
    }

    // Separate bodies to prevent sticking
    const overlap = (bodyA.bounds.width + bodyB.bounds.width) / 2 - Math.abs(dx)
    if (overlap > 0) {
      if (!bodyA.isStatic && !bodyB.isStatic) {
        bodyA.position.x -= (overlap * nx) / 2
        bodyA.position.y -= (overlap * ny) / 2
        bodyB.position.x += (overlap * nx) / 2
        bodyB.position.y += (overlap * ny) / 2
      } else if (!bodyA.isStatic) {
        bodyA.position.x -= overlap * nx
        bodyA.position.y -= overlap * ny
      } else if (!bodyB.isStatic) {
        bodyB.position.x += overlap * nx
        bodyB.position.y += overlap * ny
      }
    }
  }

  public setGravity(x: number, y: number): void {
    this.gravity = { x, y }
  }

  public setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, scale)
  }

  public getBodies(): Set<PhysicsBody> {
    return new Set(this.bodies)
  }
}
