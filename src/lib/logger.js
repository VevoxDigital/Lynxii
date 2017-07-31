/*
 * Copyright 2017 Vevox Digital under the GNU General Public License v3.0.
 */
'use strict'

require('colors')

const winston = require('winston')
require('winston-daily-rotate-file')

const LOGSDIR = './logs'

exports = module.exports = new winston.Logger({
  transports: [

    // verbose console output
    new winston.transports.Console({
      level: 'verbose',
      colorize: true
    }),

    // info files rotate daily
    new winston.transports.DailyRotateFile({
      name: 'info-file',
      filename: LOGSDIR + '/info-',
      datePattern: 'yy-MM-dd.log',
      level: 'info',
      json: false
    }),

    // error files rotate once a month
    new winston.transports.DailyRotateFile({
      name: 'error-file',
      filename: LOGSDIR + '/errors-',
      datePattern: '-yy-MM.log',
      level: 'warn',
      json: false
    })
  ]
})
