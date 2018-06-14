import { v4 as generateUUID } from 'uuid'
import createDebugLogger from './debug'

const _debug = createDebugLogger('util')

/** A point in space (or, in this case, on a map) */
export interface Point {
  /** The X value of the position */
  x: number,

  /** The Y value of the position */
  y: number
}

/** An error that was caused by another */
export class DerivedError extends Error {
  /** The error that caused this one */
  public readonly cause: Error

  /** Constructs a new error as normal, but appends the given error as a "cause" */
  constructor (msg: string, cause?: Error) {
    super(msg)

    if (cause) {
      cause.stack = 'Caused by: ' + cause.stack
      const pat = /^.+$/gm

      let line: RegExpExecArray
      while (line = pat.exec(msg)) this.stack += '    ' + line + '\n'
    }
  }
}

/** A void-returning function that does nothing */
export function noop () { }

/** Gets the keys from the given enum */
export function getEnumKeys (enumValues): Array<string> {
  const keys = Object.keys(enumValues)
  return keys.slice(keys.length / 2)
}

/** The format for unique IDs */
export const idFormat = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

/** Generates a unique v4 UUID */
export function generateUniqueID (): string {
  const id = generateUUID()
  _debug('generate unique ID %s', id)
  return id
}
