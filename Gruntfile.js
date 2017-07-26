'use strict'

const DATE = new Date()
const pkg = require('./package.json')

exports = module.exports = grunt => {
  grunt.initConfig({
    app: pkg,
    time: DATE.toUTCString(),
    year: DATE.getFullYear(),

    clean: {
      logs: [ 'logs' ]
    }
  })

  grunt.loadNpmTasks('grunt-contrib-clean')
}
