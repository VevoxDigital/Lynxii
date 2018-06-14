import Block from 'lynxii-server/block/block'
import { NodeMap } from 'lynxii-server/block/node'

import { noop, generateUniqueID, idFormat } from 'lynxii-server/util'

import { expect } from 'chai'
import 'mocha'

const id = 'io.vevox.test.foo'
const desc = {
  nodes: [ ],
  setupFunction: noop,
  defaultDisplayName: 'Foo',
  customFields: [ ],
  canHaveMultipleInstances: true
}
const uuid = generateUniqueID()
const pos = { x: 45067, y: 1337 }

describe('server/block/block', function () {
  describe('Block', function () {
    describe('static from()', function () {
      let block: Block

      it('should create a block', function () {
        block = Block.from(id, desc, uuid, pos)
        expect(block).to.be.an.instanceOf(Block)
      })

      it('should fail for invalid UUIDs', function () {
        expect(() => Block.from(id, desc, 'foo')).to.throw(/^Given UUID/)
      })

      it('should generate a UUID if none is provided', function () {
        const block = Block.from(id, desc)
        expect(block.uuid).to.match(idFormat)
      })

      it('should initialize with the given ID and UUID', function () {
        expect(block.uuid).to.equal(uuid)
        expect(block.id).to.equal(id)
      })

      it('should initialize the default metadata', function () {
        expect(block.meta.displayName).to.equal(desc.defaultDisplayName)
        expect(block.meta.position).to.equal(pos)
      })

      it('should initialize a NodeMap', function () {
        expect(block.nodes).to.be.an.instanceOf(NodeMap)
      })
    })

    describe('initialize()', function () {
      it('should invoke the function with proper context and no args', function (done) {
        let block

        const desc2 = Object.assign({ }, desc, {
          setupFunction: function (arg) {
            expect(this).to.equal(block)
            expect(arg).to.be.undefined
            done()
          }
        })

        block = Block.from(id, desc2)
        block.initialize()
      })

      it('should return itself', function () {
        const block = Block.from(id, desc)
        expect(block.initialize()).to.equal(block)
      })
    })
  })
})
