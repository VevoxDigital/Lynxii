import * as node from '@/block/node'

import { expect } from 'chai'
import 'mocha'

import { getEnumKeys } from '@/util'

describe('block/node', function () {
  describe('NodeInfo', function () {
    describe('Direction', function () {
      it('should only have two values', function () {
        expect(getEnumKeys(node.NodeInfo.Direction)).to.be.lengthOf(2)
      })
    })

    describe('Type', function () {
      it ('should only have four values', function () {
        expect(getEnumKeys(node.NodeInfo.Type)).to.be.lengthOf(4)
      })
    })
  })
})
