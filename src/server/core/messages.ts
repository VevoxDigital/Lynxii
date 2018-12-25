import { LoggingLevel } from 'vx-util'

/**
 * The handler function for outbound server messages
 */
export function onServerMessage (level: LoggingLevel, message: string): void {
  const out = level === LoggingLevel.ERROR ? process.stderr : process.stdout
  out.write(`${level}: ${message} \n`)
}
