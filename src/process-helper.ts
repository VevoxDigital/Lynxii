/// <reference path="./process.d.ts" />

import { platform, tmpdir } from 'os'
import { join } from 'path'
import { name } from '../package.json'

// tslint:disable only-arrow-functions
const writeln: NodeJS.WriteStream['writeln'] = function (message, cb?) {
  this.write((this.json ? JSON.stringify(message) : String(message)) + '\n', cb)
}

process.stdout.writeln = writeln.bind(process.stdout)
process.stderr.writeln = writeln.bind(process.stderr)

/**
 * Gets the path to the PID file for a given namespace
 *
 * - On Windows, this is `%TEMP%\lynxii\<namespace>\pid`
 * - On UNIX, this is `/run/lynxii/<namespace>/pid`
 * @param namespace The namespace to use
 * @see #getSocketPaths
 */
export function getPIDPath (namespace: string): string {
  return join(platform() === 'win32' ? tmpdir() : '/run', name, namespace, 'pid')
}

/**
 * Gets the socket paths for a given namespace.
 *
 * - On Windows, this will be `\\?\pipe\lynxii\<namespace>\fdX`.
 * - On UNIX, this will be `/run/lynxii/<namespace>/fdX`
 * @param namespace The namespace to use
 * @see #getPIDPath
 */
export function getSocketPaths (namespace: string): [ string, string, string ] {
  const prefix = join(platform() === 'win32' ? '\\\\?\\pipe' : '/run', name, namespace)
  return [
    join(prefix, 'fd0'),
    join(prefix, 'fd1'),
    join(prefix, 'fd2')
  ]
}
