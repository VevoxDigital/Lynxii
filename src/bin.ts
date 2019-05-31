
import { spawn } from 'child_process'
import { readFileSync, unlinkSync } from 'fs'
import minimist from 'minimist'
import { join } from 'path'
import * as pkg from '../package.json'
import { getNamespace, getPIDPath } from './process-helper'

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
  -p, --port      The port to bind to when launching
  -n, --namespace The namespace for the server
      --node      A path to a node binary to use for spawning the daemon
  -V, --verbose   Be more verbose in command output
  -v  --version   Alias for the 'version' command

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

function start (args: minimist.ParsedArgs) {
  process.stdout.writeln('Trying to start the daemon...')
  const attached = !!args.attached || !!args.a

  const svr = spawn(args.node ? String(args.node) : 'node', [ join(__dirname, 'main'), ...process.argv.slice(2) ], {
    cwd: process.cwd(),
    detached: !attached,
    stdio: attached ? 'inherit' : 'ignore'
  })
  if (!attached) svr.unref()
  process.stdout.writeln('Daemon started.')
}

function stop (namespace: string) {
  const pidPath = getPIDPath(namespace)
  try {
    const pid = Number.parseInt(readFileSync(pidPath).toString(), 10)
    if (isNaN(pid)) {
      process.stdout.writeln('PID data is present, but corrupt, so the daemon could not be found')
      process.stdout.writeln('Please investigate why this happened and try to track down the daemon')
      process.stdout.writeln('Once you know the process ID, gracefully shut it down by sending a SIGINT')
      return
    }
    process.stdout.writeln(`Trying to stop daemon at: ${pid}`)
    process.kill(pid, 'SIGINT')
    process.stdout.writeln('Stopped')
  } catch (err) {
    if (err.code === 'ENOENT') {
      process.stdout.writeln('No daemon was running under this namespace')
    } else if (err.code === 'ESRCH') {
      process.stdout.writeln('Daemon died or was stopped ungracefully')
      process.stdout.writeln('Trying to clean up a little, please review logs as to why this happened')
      unlinkSync(pidPath)
    } else throw err
  }
}

function status (namespace: string) {
  const pidPath = getPIDPath(namespace)
  try {
    const pid = Number.parseInt(readFileSync(pidPath).toString(), 10)
    if (isNaN(pid)) {
      process.stdout.writeln('PID data is present, but corrupt, so the daemon could not be found')
      process.stdout.writeln('Try stopping and starting the daemon')
    }
    process.stdout.writeln(`Looking for daemon at: ${pid}`)
    process.kill(pid, 0)
    process.stdout.writeln(' * Daemon found and is running')
  } catch (err) {
    if (err.code === 'ENOENT') {
      process.stdout.writeln('No daemon appears to be running on this namespace')
    } else if (err.code === 'ESRCH') {
      process.stdout.writeln(' ! Could not find the daemon here. Try restarting it?')
    } else throw err
  }
}

function main (args: minimist.ParsedArgs) {
  const cmd = args._[0] || 'help'

  if (args.J || args.json) {
    process.stdout.json = true
    process.stderr.json = true
  }

  if (args.version || cmd === 'version') return process.stdout.writeln(pkg.version)
  if (args.help || cmd === 'help') return process.stdout.writeln(help)
  if (args.about || cmd === 'about') return process.stdout.writeln(about)

  const namespace = getNamespace(args)
  process.stdout.writeln(`Using namespace: ${namespace}`)

  switch (cmd.toLowerCase()) {
    case 'start':
      start(args)
      break
    case 'stop':
      stop(namespace)
      break
    case 'status':
      status(namespace)
      break
  }

  // process.once('SIGINT', () => stop(namespace))
}

main(minimist(process.argv.slice(2)))
