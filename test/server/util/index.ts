import * as util from 'lynxii-server/util'

import { expect } from 'chai'
import 'mocha'

enum TestEnum {
  FOO,
  BAR,
  BAZ
}

describe('server/util/index', function () {
  describe('noop()', function () {
    it('should do nothing', function () {
      expect(util.noop()).to.be.undefined
    })
  })

  describe('getEnumKeys()', function () {
    it('should return an array of strings', function () {
      const keys = util.getEnumKeys(TestEnum)

      expect(keys).to.be.an.instanceOf(Array)
      expect(keys.length).to.equal(3)
      expect(keys[0]).to.equal('FOO')
      expect(keys[1]).to.equal('BAR')
      expect(keys[2]).to.equal('BAZ')
    })
  })

  describe('generateUniqueID()', function () {
    it('should return a string in UUID v4 format', function () {
      const uuid = util.generateUniqueID()

      expect(uuid).to.be.a('string')
      expect(uuid).to.match(util.idFormat)
    })
  })
})
