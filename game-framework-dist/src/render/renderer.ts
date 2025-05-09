import { EngineConfig } from '../core/engine';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: EngineConfig;
  private devicePixelRatio: number;
  private scale: number;

  constructor(config: EngineConfig) {
    this.config = config;
    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.scale = 1;

    // Remove any existing canvas
    const existingCanvas = document.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    this.canvas = document.createElement('canvas');
    this.setupCanvas();

    const context = this.canvas.getContext('2d', {
      alpha: false, // Disable alpha for better performance
      desynchronized: true, // Reduce latency
      willReadFrequently: false // Optimize for rendering
    });

    if (!context) {
      throw new Error('Failed to get 2D rendering context');
    }
    this.ctx = context;
  }

  private setupCanvas(): void {
    // Set display size
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';

    // Set actual size in memory (scaled to account for extra pixel density)
    this.canvas.width = this.config.width * this.devicePixelRatio;
    this.canvas.height = this.config.height * this.devicePixelRatio;

    // Normalize coordinate system to use CSS pixels
    this.scale = this.devicePixelRatio;
  }

  public initialize(): void {
    document.body.appendChild(this.canvas);
    this.setupMobileOptimizations();
    this.setupTouchHandling();
  }

  private setupMobileOptimizations(): void {
    if (this.config.isMobile) {
      // Enable high-quality image rendering
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';

      // Optimize canvas for mobile
      this.canvas.style.touchAction = 'none'; // Prevent default touch actions

      // Add vendor prefixed styles as data attributes to avoid TypeScript errors
      const style = this.canvas.style as any;
      style['-webkit-touch-callout'] = 'none';
      style['-webkit-user-select'] = 'none';
      style['user-select'] = 'none';

      // Optimize context
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }
  }

  private setupTouchHandling(): void {
    // No active touch event handlers needed in the renderer
    // Touch events are handled by the InputManager
  }

  public clear(): void {
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public getWidth(): number {
    return this.canvas.width / this.scale;
  }

  public getHeight(): number {
    return this.canvas.height / this.scale;
  }

  public setSize(width: number, height: number): void {
    this.canvas.width = width * this.devicePixelRatio;
    this.canvas.height = height * this.devicePixelRatio;
    this.scale = this.devicePixelRatio;
  }

  public drawRect(x: number, y: number, width: number, height: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * this.scale, y * this.scale, width * this.scale, height * this.scale);
  }

  public drawCircle(x: number, y: number, radius: number, color: string): void {
    this.ctx.beginPath();
    this.ctx.arc(x * this.scale, y * this.scale, radius * this.scale, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  public drawText(text: string, x: number, y: number, color: string, font: string = '16px Arial'): void {
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x * this.scale, y * this.scale);
  }

  public drawImage(image: HTMLImageElement, x: number, y: number, width: number, height: number): void {
    this.ctx.drawImage(
      image,
      x * this.scale,
      y * this.scale,
      width * this.scale,
      height * this.scale
    );
  }

  public drawLine(x1: number, y1: number, x2: number, y2: number, color: string, width: number = 1): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1 * this.scale, y1 * this.scale);
    this.ctx.lineTo(x2 * this.scale, y2 * this.scale);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width * this.scale;
    this.ctx.stroke();
  }
}
