
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Gets the current daemon process ID
 * @param cwd The working directory of the daemon
 */
export function getCurrentPIDSync (cwd: string): number {
  try {
    return Number.parseInt(readFileSync(join(cwd), '.pid'), 10)
  } catch (err) {
    if (!err.message.match(/^ENOENT/)) throw err
    return 0
  }
}
