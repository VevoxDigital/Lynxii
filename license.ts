/**
  * Automatic license file header generation script for VevoxDigital/Lynxii.
  * This file is not intended for distribution
  */


import { promises as fs, Stats, constants as fsConst } from 'fs'
import { execSync } from 'child_process'
import * as path from 'path'
import * as pkg from './package.json'
import * as minimist from 'minimist'

const commit = execSync('git rev-parse HEAD').toString('utf-8').substring(0, 7).toUpperCase()

// the header
const header = `/**
 * Copyright ${new Date().getFullYear()} ${pkg.author} under "${pkg.license}". See the LICENSE file for more information.
 * Compiled ${new Date().toUTCString()} from ${commit}
 */
`

/** Determines if a given file has a valid extension */
function hasExtension (file: string): boolean {
  for (const ext of pkg.project.licenseExtensions) {
    if (file.endsWith(ext)) return true
  }

  return false
}

/** Processes the given file */
async function processFile (file: string, prefix: string) {
  console.log(`prcs ${prefix}`)

  const handle = await fs.open(file, fsConst.O_RDWR | fsConst.O_CREAT)

  const contents = await fs.readFile(handle, { encoding: 'utf-8' })
  await fs.writeFile(handle, header + contents, { encoding: 'utf-8' })

  await handle.close()
}

async function preprocessFile (fileName: string, file: string, filePrefix: string, stats: Stats) {
  if (stats.isFile() && hasExtension(fileName)) await processFile(file, filePrefix)
  else if (stats.isDirectory()) await enterDirectory(file, filePrefix)
  else console.log(`skip ${filePrefix}`)
}

/** enters the given directory */
async function enterDirectory (dir: string, prefix: string) {
  console.log(`entr ${prefix}`)
  const files = await fs.readdir(dir)

  for (const fileName of files) {
    const file = path.join(dir, fileName)
    const stats = await fs.stat(file)
    const filePrefix = path.join(prefix, fileName)

    await preprocessFile(fileName, file, filePrefix, stats)
  }
}

const args = minimist(process.argv.slice(2))

const dir = args._[0]
if (!dir) throw new Error('Must specifiy a directory')

enterDirectory(path.resolve(__dirname, dir), dir).catch(console.error)
