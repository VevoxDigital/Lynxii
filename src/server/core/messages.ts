import { LoggingLevel } from 'vx-util'

/**
 * The handler function for outbound server messages
 */
export /* istanbul ignore next */ function onServerMessage (level: LoggingLevel, message: string): void {
  const out = level === LoggingLevel.ERROR ? process.stderr : process.stdout
  out.write(`${level}: ${message} \n`)
}
/*
 * This function is not covered, as all it does is take the output of the message
 * events and format them into stdout
 */
