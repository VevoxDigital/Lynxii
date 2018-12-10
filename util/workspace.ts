
import 'vx-util'
import * as pkg from '../package.json'
import { dirname, join } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import * as mkdirp from 'mkdirp'

/** Keys that are copied verbatim from the root package */
const KEYS_VERBATIM: string[] = [
  'description',
  'author',
  'contributors',
  'repository',
  'license',
  'private'
]

/** Keys that are unique per workspace */
const KEYS_UNIQUE: IDictionary<IDictionary> = {
  server: {
    productName: 'Lynxii Dedicated Server'
  }
}

const { name, version, workspaces = [] } = pkg

for (const workspacePath of workspaces) {
  const workspaceName = workspacePath.substring(4).replace(/\//g, '-')
  process.stdout.write(`loading ${workspacePath}... `)

  const workspaceJSONFile = join(__dirname, '..', workspacePath, 'package.json')

  let workspacePackageData: PackageJSON.IPackage | null = null
  try {
    workspacePackageData = JSON.parse(
      readFileSync(
        workspaceJSONFile,
        'utf8'))
    process.stdout.write('found existing package... ')
  } catch (error) {
    if (!error.message.match(/^ENOENT/)) {
      process.stderr.write('Failed to load initial JSON file, skipping\n')
      process.stderr.write(error.stack + '\n')
      continue
    }
  }

  const newPackageKeys: PackageJSON.IPackage = {
    name: `${name}-${workspaceName}`,
    version: `${version}+${workspaceName}`
  }

  // copy unique keys
  const uniqueKeyset = KEYS_UNIQUE[workspaceName]
  if (uniqueKeyset) {
    for (const uniqueKey of Object.keys(uniqueKeyset)) newPackageKeys[uniqueKey] = uniqueKeyset[uniqueKey]
  }

  // copy in verbatim keys
  for (const verbatimKey of KEYS_VERBATIM) newPackageKeys[verbatimKey] = pkg[verbatimKey]

  // if the package previously existed, preserve depenencies
  if (workspacePackageData) {
    for (const existingPackageKey in Object.keys(workspacePackageData)) {
      if (existingPackageKey.match(/[Dd]ependencies$/)) newPackageKeys[existingPackageKey] = workspacePackageData[existingPackageKey]
    }
  }

  // write out the new file
  try {
    mkdirp.sync(dirname(workspaceJSONFile))
    writeFileSync(
      workspaceJSONFile,
      JSON.stringify(newPackageKeys, null, 2),
      'utf8')
    process.stdout.write('done\n')
  } catch (error) {
    process.stderr.write('Failed to write new package, skipping\n')
    process.stderr.write(error.stack + '\n')
  }
}
