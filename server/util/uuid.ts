import { v4 as generate } from 'uuid'
import createDebugLogger from 'server/util/debug'

const _debug = createDebugLogger('uuid')

/**
  * Generates a unique namespace'd v5 UUID, using the global namespace if no
  * namespace was specified.
  */
export function generateUniqueID (): string {
  const id = generate()
  _debug('generate unique ID %s', id)
  return id
}
