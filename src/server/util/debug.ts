import * as debug from 'debug'

import { name } from '../package.json'

/**
  * Creates a new debug logger
  * @param prefix - The prefix to use for the logger
  */
export default function createDebugLogger (...prefix: string[]): debug.IDebugger {
  return debug([name].concat(prefix).join(':'))
}
