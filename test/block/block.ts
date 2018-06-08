import Block from '@/block/block'

import { expect } from 'chai'
import 'mocha'

const noop = () => { }

describe('block/block', function () {
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
        expect(b.uuid).to.be.equal('foo')

        expect(init('')).to.throw(/^UUID must/)
      })
    })
  })
})
