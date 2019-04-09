/// <reference path="./process.d.ts" />

// tslint:disable only-arrow-functions
const writeln: NodeJS.WriteStream['writeln'] = function (message, cb?) {
  this.write((this.json ? JSON.stringify(message) : String(message)) + '\n', cb)
}

process.stdout.writeln = writeln.bind(process.stdout)
process.stderr.writeln = writeln.bind(process.stderr)
