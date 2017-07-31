/*
 * Copyright 2017 Vevox Digital under the GNU General Public License v3.0.
 */
'use strict'

const q = require('q')

const commands = new Map()
exports.$commands = commands

exports.exec = str => {
  const args = str.split(' ') // TODO quote parsing?
  const name = args.shift()

  const cmd = commands.get(name)
  if (cmd) {
    return cmd.exec(args)
  } else return q.reject()
}

class Command {
  constructor (name, func) {
    Object.defineProperty(this, 'name', { value: name, enumerable: true })
    Object.defineProperty(this, '$exec', { value: func })
  }

  exec (args = [ ]) {
    // args.unshift(this.name)
    return q(this.$exec.apply(null, args))
  }
}
exports.Command = Command

class CommandAlias extends Command {
  constructor (name, target) {
    super(name, (...args) => {
      return exports.exec(`${target} ${args.join(' ')}\n`)
    })
  }
}
exports.CommandAlias = CommandAlias

function registerCommand (cmd) {
  commands.set(cmd.name, cmd)
}

// COMMAND REGISTRATION

registerCommand(new Command('exit', () => {
  // TODO close the server
  if (Util.prompt) Util.prompt.close()
}))
registerCommand(new CommandAlias('quit', 'exit'))
