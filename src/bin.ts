
import '@vevox/util-common'
import * as fs from 'fs'
import * as minimist from 'minimist'
import { join } from 'path'
import * as pkg from '../package.json'
import './process-helper'

const help = `
Usage:
  lynxii [command=status] [options]

Lynxii Server CLI

Options:
      --about     Alias for the 'about' command
  -a, --attached  Launch the server in attached mode instead of as a daemon
  -c, --config    A path to a config file to use, defaults to 'lynxii.json'
      --help      Alias for the 'help' command
  -h, --host      The hostname to bind to when launching
  -J, --json      Output results as JSON instead of as human-readable string
  -p, --port      The port to bind to when launching
  -P, --pid-file  A path to the PID file, defaults to 'daemon.pid'
  -v, --verbose   Be more verbose in command output
      --version   Alias for the 'version' command

Commands:
  about     Prints information about Lynxii
  help      Prints this help message
  start     Starts the server, if it is not already
  status    Gets the current server status summary
  stop      Stops the server, if it is running
  version   Prints the current version number`

const about = `
Lynxii Core and Lynxii Server CLI Tool v${pkg.version}

Designed and developed by Matthew Struble
in association with Vevox Digital
of Des Moines, IA, United States

Website:
https://vevox.io/project/lynxii

Related Sources:
https://lab.vevox.io/open-source/lynxii

Contact:
matt@vevox.io
@CynicalBusiness

  Copyright (C) 2018 Matthew Struble

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.

Myra ta Hayzel; Pal, Kifitae te Entra en na Loka`

function main (args: minimist.ParsedArgs) {
  const cmd = args._[0]

  if (args.J || args.json) {
    process.stdout.json = true
    process.stderr.json = true
  }

  if (args.version || cmd === 'version') return process.stdout.writeln(pkg.version)
  if (args.help || cmd === 'help') return process.stdout.writeln(help)
  if (args.about || cmd === 'about') return process.stdout.writeln(about)

  const [ pid, pidFD ] = getPID(args.P || args['pid-file'] || 'daemon.pid')

  process.stdout.writeln('pid: ' + pid)

  fs.closeSync(pidFD)
}

/**
 * Gets a PID from a given PID file, returning it and the file descriptor to the PID file
 * @param pidFileName The name of the PID file
 */
function getPID (pidFileName: string): [ number, number ] {
  if (typeof pidFileName !== 'string' || !pidFileName.length) {
    throw new Error('PID file name, if specified, must be a string')
  }
  const pidFile = join(process.cwd(), pidFileName)
  const pidFD = fs.openSync(pidFile, fs.constants.O_RDWR | fs.constants.O_CREAT)

  const buffer = Buffer.alloc(64) // 64 should be fine for this
  const read = fs.readSync(pidFD, buffer, 0, buffer.length, null)
  return [ Number.parseInt(Buffer.from(buffer, 0, read).toString().trim(), 10), pidFD ]
}

main(minimist(process.argv.slice(2)))
