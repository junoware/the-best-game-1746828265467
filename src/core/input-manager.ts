export interface TouchPoint {
  x: number
  y: number
  id: number
}

export interface InputConfig {
  isMobile?: boolean
  enableKeyboard?: boolean
  enableMouse?: boolean
  enableTouch?: boolean
}

export class InputManager {
  private isMobile: boolean
  private keys: Set<string>
  private touchPoints: Map<number, TouchPoint>
  private lastTouchTimestamp: number = 0
  private mousePosition: { x: number; y: number }
  private mouseButtons: Set<number>
  private enableKeyboard: boolean
  private enableMouse: boolean
  private enableTouch: boolean
  private tapListeners: Set<() => void> = new Set()

  constructor(config: InputConfig = {}) {
    this.isMobile = config.isMobile || false
    this.enableKeyboard = config.enableKeyboard ?? true
    this.enableMouse = config.enableMouse ?? true
    this.enableTouch = config.enableTouch ?? true
    this.keys = new Set()
    this.touchPoints = new Map()
    this.mousePosition = { x: 0, y: 0 }
    this.mouseButtons = new Set()
  }

  public initialize(): void {
    if (this.enableKeyboard) {
      this.setupKeyboardEvents()
    }
    if (this.enableMouse) {
      this.setupMouseEvents()
    }
    if (this.enableTouch) {
      this.setupTouchEvents()
    }
  }

  private setupKeyboardEvents(): void {
    window.addEventListener('keydown', (event) => {
      this.keys.add(event.key.toLowerCase())
    })

    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.key.toLowerCase())
    })
  }

  private setupMouseEvents(): void {
    window.addEventListener('mousemove', (event) => {
      this.mousePosition.x = event.clientX
      this.mousePosition.y = event.clientY
    })

    window.addEventListener('mousedown', (event) => {
      this.mouseButtons.add(event.button)
    })

    window.addEventListener('mouseup', (event) => {
      this.mouseButtons.delete(event.button)
    })

    // Add click handler for non-mobile
    window.addEventListener('click', () => {
      if (!this.isMobile) {
        this.notifyTapListeners()
      }
    })
  }

  private setupTouchEvents(): void {
    // Handle touch start - using passive listeners to avoid warnings
    document.addEventListener('touchstart', (event) => {
      // Store touch points
      for (let i = 0; i < event.changedTouches.length; i++) {
        const touch = event.changedTouches[i]
        this.touchPoints.set(touch.identifier, {
          id: touch.identifier,
          x: touch.clientX,
          y: touch.clientY
        })
      }

      // Record timestamp to detect taps
      this.lastTouchTimestamp = Date.now()
    }, { passive: true })

    // Handle touch move
    document.addEventListener('touchmove', (event) => {
      // Update touch points
      for (let i = 0; i < event.changedTouches.length; i++) {
        const touch = event.changedTouches[i]
        if (this.touchPoints.has(touch.identifier)) {
          this.touchPoints.set(touch.identifier, {
            id: touch.identifier,
            x: touch.clientX,
            y: touch.clientY
          })
        }
      }
    }, { passive: true })

    // Handle touch end
    document.addEventListener('touchend', (event) => {
      // Remove touch points
      for (let i = 0; i < event.changedTouches.length; i++) {
        const touch = event.changedTouches[i]
        this.touchPoints.delete(touch.identifier)
      }

      // Detect tap (quick touch under 300ms)
      const touchDuration = Date.now() - this.lastTouchTimestamp
      if (touchDuration < 300) {
        this.notifyTapListeners()
      }
    }, { passive: true })

    // Handle touch cancel
    document.addEventListener('touchcancel', (event) => {
      // Remove touch points
      for (let i = 0; i < event.changedTouches.length; i++) {
        const touch = event.changedTouches[i]
        this.touchPoints.delete(touch.identifier)
      }
    }, { passive: true })
  }

  // Register tap event listener
  public onTap(callback: () => void): void {
    this.tapListeners.add(callback)
  }

  // Remove tap event listener
  public offTap(callback: () => void): void {
    this.tapListeners.delete(callback)
  }

  // Notify all tap listeners
  private notifyTapListeners(): void {
    this.tapListeners.forEach(callback => callback())
  }

  public isKeyPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase())
  }

  public getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition }
  }

  public isMouseButtonPressed(button: number): boolean {
    return this.mouseButtons.has(button)
  }

  public getTouchPoints(): TouchPoint[] {
    return Array.from(this.touchPoints.values())
  }

  public isMobileDevice(): boolean {
    return this.isMobile
  }
}
