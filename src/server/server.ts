import * as fs from 'fs'
import * as mkdirp from 'mkdirp'
import * as net from 'net'
import { dirname } from 'path'
import { getPIDPath, getSocketPath } from '../process-helper'

export interface ILynxiiServerOptions {
  /** The namespace this server is running in */
  namespace: string
}

/**
 * The main Lynxii server
 */
export default class LynxiiServer {

  /** The name of the data directory */
  public static readonly DATADIR = 'data'

  /** The character used to separate the end of the startup sequence */
  public static readonly SEP = '\u001F'

  /** Options the server was initialized with */
  public readonly opts: ILynxiiServerOptions

  private intv?: NodeJS.Timeout
  private socket: net.Server
  private socketPool: Dictionary<net.Socket> = { }

  public constructor (opts: ILynxiiServerOptions) {
    this.opts = opts

    this.socket = net.createServer()
  }

  /**
   * Creates a new PID file, failing if one already exists
   */
  public createPID () {
    const pp = getPIDPath(this.opts.namespace)
    mkdirp.sync(dirname(pp))

    const fd = fs.openSync(pp, 'wx') // this'll fail if the process already exists
    fs.writeSync(fd, Buffer.from(String(process.pid)))
  }

  public createSocket () {
    this.socket.on('connection', stream => {
      const id = Date.now().toString(16)
      this.socketPool[id] = stream
      process.stdout.writeln(`connected: ${id}`)

      stream.once('end', () => {
        process.stdout.writeln(`disconnected: ${id}`)
        delete this.socketPool[id]
      })

      stream.on('data', data => {
        stream.write(`${id}: ${data}`)
        process.stdout.writeln(`${id}: ${data}`)
      })
    })

    this.socket.listen(getSocketPath(this.opts.namespace))
  }

  /**
   * Send data to all listeners on the domain socket
   * @param data The data to send
   */
  public send (data: string | Buffer | Uint8Array): void {
    for (const key in Object.keys(this.socketPool)) this.socketPool[key]!.write(data)
  }

  /**
   * Clears a PID file
   */
  public clearPID () {
    try {
      fs.unlinkSync(getPIDPath(this.opts.namespace))
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
  }

  public closeSocket () {
    for (const key of Object.keys(this.socketPool)) {
      const stream = this.socketPool[key]!
      stream.write('connection closed\n')
      stream.end()
      delete this.socketPool[key]
    }

    this.socket.close()
  }

  public start () {
    this.createPID()
    this.createSocket()
    process.stdout.writeln('hello, world!')

    this.intv = setInterval(() => {
      process.stdout.writeln(new Date().getTime())
    }, 1000)

    // when done, spit out a the separator
    process.stdout.write(LynxiiServer.SEP + '\n')
  }

  public stop () {
    if (this.intv) clearInterval(this.intv)
    this.closeSocket()
    this.clearPID()
  }
}
