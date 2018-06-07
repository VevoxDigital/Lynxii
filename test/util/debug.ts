import createDebugLogger from '../../src/util/debug'
import { expect } from 'chai'

import 'mocha'

describe('util/debug', function () {
  describe('createDebugLogger()', function () {
    const _debug = createDebugLogger('test')

    it('should return a function', function () {
      expect(_debug).to.be.a('function')
    })
  })
})
