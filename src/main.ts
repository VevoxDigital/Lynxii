
import * as minimist from 'minimist'
import LynxiiServer from './server/server'

const args = minimist(process.argv.slice(2))

const server = new LynxiiServer({
  namespace: args.n || args.namespace || 'default'
})
server.start()

process.on('SIGINT', () => {
  server.stop()
})
