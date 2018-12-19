
import 'vx-util'
import * as minimist from 'minimist'
import { version } from '../package.json'

const COMMAND = {
  help: 'help',
  start: 'start',
  stop: 'stop',
  version: 'version'
}

const ARGS = minimist(process.argv.slice(2))
if (!ARGS._[0]) ARGS._[0] = COMMAND.start
if (ARGS._.length > 1) process.stdout.write(`Warning: ignored extranious arguments on daemon command: ${ARGS._.slice(1)}\n`)

switch (ARGS._[0]) {
  case COMMAND.start:
    // try and start the daemon
    break

  case COMMAND.stop:
    // try and stop the daemon
    break

  case COMMAND.help:
    // display some help
    process.stdout.write(`Lynxii Daemon v${version}
    help ---- Shows this help
    start --- Starts the daemon, if it is not already running
    stop ---- Stops the daemon, if it is running
    version - Shows the current version

    -V, --verbose
      Sets logging mode to verbose.
    `)
    break

  case COMMAND.version:
    process.stdout.write(version + '\n')
    break
}
