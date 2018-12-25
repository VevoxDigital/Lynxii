import { onServerMessage } from './core/messages'
import LynxiiServer from './core/server'

const server = new LynxiiServer()
server.events.on('message', onServerMessage)
server.message('hello world!')
