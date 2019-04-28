
import expect = require('expect.js')
import 'mocha'

import AbstractAddress from '../../src/net/address/address'
// import INetAddress4 from '../../src/net/address/inet4'
import MACAddress from '../../src/net/address/mac'

describe('net/address', () => {

  // net/address/address
  describe('AbstractAddress', () => {

    describe('static valueFromString', () => {

      it('should take a string value at create an numerical value', () => {
        const val = AbstractAddress.valueFromString('01:AA:11', 8, 3)
        expect(val).to.be.a('bigint')
        expect(val).to.equal(0x1AA11n)
      })

      it('should fill zeros and trim as needed to coerce', () => {
        const val = AbstractAddress.valueFromString('f:oo-bar:AA', 8, 2)
        expect(val).to.be.a('bigint')
        expect(val).to.equal(0xF00n)
      })

    })

    describe('static valueFromGroups', () => {

      it('should take group values and convert them to the numerical value', () => {
        const val = AbstractAddress.valueFromGroups([ 0n, 0xAAn, 0x11n ], 8, 3)
        expect(val).to.be.a('bigint')
        expect(val).to.equal(0xAA11n)
      })

    })

    describe('static availableAddresses', () => {

      it('should given the number of available addresses for a pool', () => {
        expect(AbstractAddress.availableAddresses(32, 24)).to.equal(256)
      })

    })

    describe('static recommendedMask', () => {

      it('should give the best recommended mask', () => {
        expect(AbstractAddress.recommendedMask(32, 2)).to.equal(30)
      })

      it('should round appropreately if a group rounding is given', () => {
        it('should give the best recommended mask', () => {
          expect(AbstractAddress.recommendedMask(32, 2, 8)).to.equal(24)
        })
      })

    })

  })

  describe('MACAddress', () => {

    describe('<init>', () => {

      it('should create a MACAddress instance', () => {
        const mac = new MACAddress(200n)
        expect(mac.groupCount).to.equal(MACAddress.GROUP_COUNT)
        expect(mac.groupWidth).to.equal(MACAddress.GROUP_WIDTH)
        expect(mac.value).to.equal(200n)
      })

    })

  })
})
