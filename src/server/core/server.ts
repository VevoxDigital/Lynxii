
import { EventEmitter } from 'events'
import StrictEventEmitter from 'strict-event-emitter-types'
import { LoggingLevel } from 'vx-util'

export interface ILynxiiServerEvent {
  /** Logging message from the server */
  message: (level: LoggingLevel, message: string) => void
}

/**
 * This is the main Lynxii server object, acting as the starting point for the server,
 * the input target for incoming events, and the source of any outgoing server events.
 *
 * @see ILynxiiServerEvent
 */
export default class LynxiiServer {
  /** Event controller for the lynxii server */
  public readonly events: StrictEventEmitter<EventEmitter, ILynxiiServerEvent>

  constructor () {
    this.events = new EventEmitter()
    this.attachEventHandlers()
  }

  /**
   * Emits an info-level message from the server
   * @param message The message to emit
   */
  public message (message: string): void

  /**
   * Emits a message from the server at the specified level
   * @param level The level to emit at
   * @param message The message to emit
   */
  public message (level: LoggingLevel, message: string): void

  /* Override implementation */
  public message (level: LoggingLevel | string, message?: string): void {
    if (typeof level === 'string') this.events.emit('message', LoggingLevel.INFO, level)
    else this.events.emit('message', level, message || '')
  }

  /** Attach all event handlers */
  private attachEventHandlers (): void {
    // attach event handlers here
  }
}
