import * as node from 'server/block/node'
import Block from 'server/block/block'

import { expect } from 'chai'
import 'mocha'

import { getEnumKeys, noop } from 'server/util'

describe('server/block/node', function () {
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

  describe('NodeMap', function () {
    const input = {
      direction: node.NodeInfo.Direction.INPUT,
      type: node.NodeInfo.Type.STRING,
      validator: s => s.match(/^foo/)
    }
    const output = {
      direction: node.NodeInfo.Direction.OUTPUT,
      type: node.NodeInfo.Type.BOOLEAN
    }

    describe('<init>', function () {
      it('should create nodes for each definition', function () {
        const map = new node.NodeMap([ input, input, output ], null)

        expect(map.inputCount).to.equal(2)
        expect(map.outputCount).to.equal(1)
      })
    })

    describe('getInput()', function () {
      const map = new node.NodeMap([ input ], null)

      it('should return the node at the given index', function () {
        expect(map.getInput(0)).to.be.an.instanceOf(node.Node)
      })

      it('should return undefined for a out-of-bounds index', function () {
        expect(map.getInput(1)).to.be.undefined
      })
    })

    describe('getOutput()', function () {
      const map = new node.NodeMap([ output ], null)

      it('should return the node at the given index', function () {
        expect(map.getOutput(0)).to.be.an.instanceOf(node.Node)
      })

      it('should return undefined for a out-of-bounds index', function () {
        expect(map.getOutput(1)).to.be.undefined
      })
    })
  })

  describe('Node', function () {

  })
})
