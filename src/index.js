'use strict'

const path = require('path')
const readline = require('readline')
const fs = require('fs')

const command = require(path.join(__dirname, 'command.js'))

global.Util = require(path.join(__dirname, 'lib', 'util.js'))

// make the logs folder
const logsdir = path.join(Util.dirs.root, 'logs')
try {
  fs.statSync(logsdir)
  // file exists, move on
} catch (e) {
  fs.mkdirSync(path.join(Util.dirs.root, 'logs'))
}

Util.initConfig().then(() => {
  Util.log.info('configuration loaded, starting up')

  // TODO spawn the server
  // possibly prompt in a child process?

  if (!Util.config.get('no-prompt')) {
    // if '--no-prompt' wasn't specified, spawn a CLI interface.
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: Util.app.name + '> '
    })

    Util.prompt = rl

    let reprompt = true

    rl.prompt()
    rl.on('line', line => {
      line = line.trim()
      Util.log.info('[cmd] ' + line)
      command.exec(line).then(res => {
        // if command executed successfully
        if (res) Util.log.info(res)
      }).catch(err => {
        if (!err) {
          // unknown command
          Util.log.info(`unknown input`)
        } else {
          // command failed
          Util.log.error('error during command execution')
          if (err) Util.log.error(`${err.message}\n${err.stack}`)
        }
      }).finally(() => {
        // after execution, re-prompt user
        if (reprompt) rl.prompt()
      }).done()
    }).on('close', () => {
      Util.log.info('app exiting')
      // TODO exit wrap-up

      Util.log.info('')
      reprompt = false
    })

    rl.on('SIGINT', () => {
      rl.write('exit\n')
    })
  }
})
