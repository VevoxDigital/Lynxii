import * as fs from 'fs'
import * as mkdirp from 'mkdirp'
import { dirname } from 'path'
import { getPIDPath } from '../process-helper'

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

  public readonly opts: ILynxiiServerOptions

  private intv?: NodeJS.Timeout

  public constructor (opts: ILynxiiServerOptions) {
    this.opts = opts
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

  public start () {
    this.createPID()
    process.stdout.writeln('hello, world!')

    this.intv = setInterval(() => {
      process.stdout.writeln(new Date().getTime())
    }, 1000)

    // when done, spit out a the separator
    process.stdout.write(LynxiiServer.SEP + '\n')
  }

  public stop () {
    if (this.intv) clearInterval(this.intv)
    this.clearPID()
  }
}
