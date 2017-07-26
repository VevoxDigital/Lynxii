'use strict'

const q = require('q')
const nconf = require('nconf')
const fs = require('fs-extra')
const path = require('path')

exports.dirs = {
  root: path.join(__dirname, '..', '..'),
  src: path.join(__dirname, '..'),
  lib: __dirname
}

exports.log = require(path.join(exports.dirs.lib, 'logger.js'))
exports.app = require(path.join(exports.dirs.root, 'package.json'))

const CONFIG_FILE = path.join(exports.dirs.root, 'config.json')

exports.initConfig = () => {
  const deferred = q.defer()

  nconf.file(CONFIG_FILE)
    .argv().env([ 'none' ]) // whitelist 'env' so 50+ things don't appear
    .defaults(exports.app.config)

  nconf.required([
    'server:port'
  ])

  fs.writeFile(CONFIG_FILE, JSON.stringify(nconf.get(), null, 2), err => {
    if (err) return deferred.reject(err)
    nconf.file(CONFIG_FILE)
    exports.config = nconf
    deferred.resolve()
  })

  return deferred.promise
}

exports.saveConfig = () => {
  const deferred = q.defer()

  nconf.save(err => {
    if (err) return deferred.reject(err)
    deferred.resolve()
  })

  return deferred.promise
}
