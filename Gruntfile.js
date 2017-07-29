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
    },

    'mocha_istanbul': {
      src: {
        options: {
          root: './src',
          istanbulOptions: [ '-x', 'index.js' ]
        },
        src: [ 'test/**/*.js' ]
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-mocha-istanbul')

  grunt.registerTask('test', [
    'mocha_istanbul:src'
  ])
}
