/**
  * Automatic license file header generation script for VevoxDigital/Lynxii.
  * This file is not intended for distribution
  */
'use strict'

// the header
const header = `
 * Copyright ${new Date().getFullYear()} Vevox Digital under the GNU General Public License v3.0.
 `

// appending code
const fs = require('fs-extra')
const klawSync = require('klaw-sync')

console.log('appending licensing information...')

const paths = klawSync('./src', { nodir: true })
for (const path of paths) {
  let contents = fs.readFileSync(path.path).toString()

  // remove any existing comments
  if (contents.startsWith('/*')) contents = contents.substring(contents.indexOf('*/') + 3)
  contents = `/*${header}*/\n${contents}`

  fs.writeFileSync(path.path, contents)
  console.log(' + ' + path.path)
}
