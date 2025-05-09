export interface AssetConfig {
  baseUrl?: string
  images?: { [key: string]: string }
  audio?: { [key: string]: string }
  fonts?: { [key: string]: string }
}

export class AssetManager {
  private baseUrl: string = ''
  private images: Map<string, HTMLImageElement> = new Map()
  private audio: Map<string, HTMLAudioElement> = new Map()
  private fonts: Map<string, FontFace> = new Map()
  private loadingPromises: Promise<void>[] = []

  public async initialize(config: AssetConfig): Promise<void> {
    this.baseUrl = config.baseUrl || ''

    if (config.images) {
      for (const [key, path] of Object.entries(config.images)) {
        this.loadingPromises.push(this.loadImage(key, path))
      }
    }

    if (config.audio) {
      for (const [key, path] of Object.entries(config.audio)) {
        this.loadingPromises.push(this.loadAudio(key, path))
      }
    }

    if (config.fonts) {
      for (const [key, path] of Object.entries(config.fonts)) {
        this.loadingPromises.push(this.loadFont(key, path))
      }
    }

    await Promise.all(this.loadingPromises)
  }

  private async loadImage(key: string, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        this.images.set(key, image)
        resolve()
      }
      image.onerror = () => {
        reject(new Error(`Failed to load image: ${path}`))
      }
      image.src = this.baseUrl + path
    })
  }

  private async loadAudio(key: string, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.oncanplaythrough = () => {
        this.audio.set(key, audio)
        resolve()
      }
      audio.onerror = () => {
        reject(new Error(`Failed to load audio: ${path}`))
      }
      audio.src = this.baseUrl + path
    })
  }

  private async loadFont(key: string, path: string): Promise<void> {
    try {
      const font = new FontFace(key, `url(${this.baseUrl + path})`)
      const loadedFont = await font.load()
      document.fonts.add(loadedFont)
      this.fonts.set(key, loadedFont)
    } catch (error) {
      throw new Error(`Failed to load font: ${path}`)
    }
  }

  public getImage(key: string): HTMLImageElement | undefined {
    return this.images.get(key)
  }

  public getAudio(key: string): HTMLAudioElement | undefined {
    return this.audio.get(key)
  }

  public getFont(key: string): FontFace | undefined {
    return this.fonts.get(key)
  }

  public async preloadImage(path: string): Promise<HTMLImageElement> {
    const key = path
    if (!this.images.has(key)) {
      await this.loadImage(key, path)
    }
    return this.images.get(key)!
  }

  public async preloadAudio(path: string): Promise<HTMLAudioElement> {
    const key = path
    if (!this.audio.has(key)) {
      await this.loadAudio(key, path)
    }
    return this.audio.get(key)!
  }

  public async preloadFont(path: string): Promise<FontFace> {
    const key = path
    if (!this.fonts.has(key)) {
      await this.loadFont(key, path)
    }
    return this.fonts.get(key)!
  }
}
