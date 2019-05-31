
import minimist from 'minimist'
import { getNamespace } from './process-helper'
import LynxiiServer from './server/server'

const args = minimist(process.argv.slice(2))

const server = new LynxiiServer({
  namespace: getNamespace(args)
})
server.start()

process.on('SIGINT', () => {
  server.stop()
})
