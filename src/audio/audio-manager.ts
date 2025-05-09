export interface AudioConfig {
  masterVolume?: number
  musicVolume?: number
  sfxVolume?: number
}

export class AudioManager {
  private masterVolume: number = 1.0
  private musicVolume: number = 1.0
  private sfxVolume: number = 1.0
  private currentMusic: HTMLAudioElement | null = null
  private audioContext: AudioContext | null = null

  public async initialize(config: AudioConfig): Promise<void> {
    this.masterVolume = config.masterVolume ?? 1.0
    this.musicVolume = config.musicVolume ?? 1.0
    this.sfxVolume = config.sfxVolume ?? 1.0

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)()
    } catch (error) {
      console.warn('Web Audio API not supported')
    }
  }

  public update(): void {
    // Update audio state if needed
  }

  public playMusic(audio: HTMLAudioElement, loop: boolean = true): void {
    if (this.currentMusic) {
      this.currentMusic.pause()
      this.currentMusic.currentTime = 0
    }

    audio.loop = loop
    audio.volume = this.masterVolume * this.musicVolume
    audio.play().catch((error) => {
      console.warn('Failed to play music:', error)
    })

    this.currentMusic = audio
  }

  public stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause()
      this.currentMusic.currentTime = 0
      this.currentMusic = null
    }
  }

  public playSound(audio: HTMLAudioElement): void {
    const sound = audio.cloneNode() as HTMLAudioElement
    sound.volume = this.masterVolume * this.sfxVolume
    sound.play().catch((error) => {
      console.warn('Failed to play sound:', error)
    })
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    this.updateVolumes()
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume))
    this.updateVolumes()
  }

  public setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume))
  }

  private updateVolumes(): void {
    if (this.currentMusic) {
      this.currentMusic.volume = this.masterVolume * this.musicVolume
    }
  }

  public getMasterVolume(): number {
    return this.masterVolume
  }

  public getMusicVolume(): number {
    return this.musicVolume
  }

  public getSFXVolume(): number {
    return this.sfxVolume
  }

  public getAudioContext(): AudioContext | null {
    return this.audioContext
  }
}
