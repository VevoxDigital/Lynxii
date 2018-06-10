import Block from 'server/block/block'

import { noop } from 'server/util'

import { expect } from 'chai'
import 'mocha'

describe('server/block/block', function () {
  describe('Block', function () {
    describe('<init>', function () {
      it('should initialize a NodeMap and UUID', function () {
        const b = new Block(noop, [ ])
        expect(b.uuid).to.be.a('string')
        expect(b.nodes.getInput(0)).to.be.undefined
      })

      it('should accept any non-zero-length string for a UUID', function () {
        const init = (id: string) => {
          return () => new Block(noop, [ ], id)
        }

        let b: Block
        expect(() => { b = init('foo')() }).to.not.throw()
        expect(b.uuid).to.equal('foo')

        expect(init('')).to.throw(/^UUID must/)
      })
    })

    describe('initialize()', function () {
      it('should invoke the function with proper context and no args', function (done) {
        const b = new Block(function (arg) {
          expect(this).to.equal(b)
          expect(arg).to.be.undefined
          done()
        }, [ ])

        b.initialize()
      })

      it('should return itself', function () {
        const b = new Block(noop, [ ])
        expect(b.initialize()).to.equal(b)
      })
    })
  })
})
