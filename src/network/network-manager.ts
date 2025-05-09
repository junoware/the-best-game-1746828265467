export interface NetworkConfig {
  serverUrl: string
  reconnectAttempts?: number
  reconnectDelay?: number
  pingInterval?: number
}

export class NetworkManager {
  private serverUrl: string = ''
  private socket: WebSocket | null = null
  private reconnectAttempts: number = 5
  private reconnectDelay: number = 1000
  private pingInterval: number = 30000
  private currentAttempt: number = 0
  private pingTimer: number | null = null
  private messageQueue: any[] = []
  private eventHandlers: Map<string, ((data: any) => void)[]> = new Map()

  public async initialize(config: NetworkConfig): Promise<void> {
    this.serverUrl = config.serverUrl
    this.reconnectAttempts = config.reconnectAttempts ?? 5
    this.reconnectDelay = config.reconnectDelay ?? 1000
    this.pingInterval = config.pingInterval ?? 30000

    await this.connect()
  }

  private async connect(): Promise<void> {
    try {
      this.socket = new WebSocket(this.serverUrl)
      this.setupSocketHandlers()
      this.startPingTimer()
    } catch (error) {
      console.error('Failed to connect to server:', error)
      this.handleDisconnect()
    }
  }

  private setupSocketHandlers(): void {
    if (!this.socket) return

    this.socket.onopen = () => {
      console.log('Connected to server')
      this.currentAttempt = 0
      this.flushMessageQueue()
    }

    this.socket.onclose = () => {
      console.log('Disconnected from server')
      this.handleDisconnect()
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        this.handleMessage(message)
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    }
  }

  private handleDisconnect(): void {
    this.stopPingTimer()

    if (this.currentAttempt < this.reconnectAttempts) {
      this.currentAttempt++
      console.log(
        `Reconnecting... Attempt ${this.currentAttempt}/${this.reconnectAttempts}`,
      )
      setTimeout(() => this.connect(), this.reconnectDelay)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  private startPingTimer(): void {
    this.stopPingTimer()
    this.pingTimer = window.setInterval(() => {
      this.send('ping', { timestamp: Date.now() })
    }, this.pingInterval)
  }

  private stopPingTimer(): void {
    if (this.pingTimer !== null) {
      clearInterval(this.pingTimer)
      this.pingTimer = null
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      this.sendRaw(message)
    }
  }

  public send(type: string, data: any): void {
    const message = {
      type,
      data,
      timestamp: Date.now(),
    }

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.sendRaw(message)
    } else {
      this.messageQueue.push(message)
    }
  }

  private sendRaw(message: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    }
  }

  private handleMessage(message: any): void {
    const handlers = this.eventHandlers.get(message.type)
    if (handlers) {
      handlers.forEach((handler) => handler(message.data))
    }
  }

  public on(type: string, handler: (data: any) => void): void {
    const handlers = this.eventHandlers.get(type) || []
    handlers.push(handler)
    this.eventHandlers.set(type, handlers)
  }

  public off(type: string, handler: (data: any) => void): void {
    const handlers = this.eventHandlers.get(type)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index !== -1) {
        handlers.splice(index, 1)
      }
    }
  }

  public update(): void {
    // Process any pending network operations if needed
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    this.stopPingTimer()
  }

  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }
}
