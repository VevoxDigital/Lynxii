import * as pkg from '@/package.json'
import * as path from 'path'
import * as minimist from 'minimist'
import { promises as fs } from 'fs'
import { spawn } from 'child_process'

/** Generates the effective package JSON */
function generateEffectivePackage (name: string, overrides, keys): any {
  const eff = Object.assign({ }, keys, overrides)
  eff.version += '+' + name
  delete eff.devDependencies

  return eff
}

/** installed the dependencies for a given dir */
async function installDependencies (dir: string) {
  return new Promise((resolve, reject) => {
    const p = spawn('yarn', [], {
      cwd: dir,
      stdio: 'inherit'
    })

    p.on('error', reject)
    p.on('exit', code => {
      if (code === 0) resolve()
      else reject(new Error('dependency installationed failed with code: ' + code))
    })
  })
}

/** Processes the given project */
async function processProject (name: string) {
  console.log(`processing project: ${name}`)
  const dir = path.join(__dirname, name)
  const stats = await fs.stat(dir)
  if (!stats.isDirectory()) throw new Error ('ENOTDIR: Given project is not a directory')

  const pkgDir = path.join(dir, 'package.json')
  const pkgStats = await fs.stat(pkgDir)
  if (!pkgStats.isFile()) throw new Error('ENOTFILE: Given project\'s package is not a file')

  const overrides = pkg.project.overridePackageKeys[name] || { }
  const keys = { }

  for (const key of pkg.project.forwardedPackageKeys) keys[key] = pkg[key]

  const handle = await fs.open(pkgDir, 'r+')

  const currentPkg = JSON.parse((await fs.readFile(handle)).toString('utf-8'))
  keys['dependencies'] = currentPkg.dependencies

  await fs.writeFile(handle, JSON.stringify(generateEffectivePackage(name, overrides, keys), null, 2))
  await handle.close()

  await installDependencies(dir)
}

const args = minimist(process.argv.slice(2))
const project = args._[0]

if (!project) throw new Error('A project name must be provided')
processProject(project).catch(console.error)
