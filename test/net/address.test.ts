import { expect } from 'chai'
import 'mocha'

import AbstractAddress from '../../src/net/address/index'

const TEST_BYTES = [0xFF, 0]
const TEST_SEP = '.'

class AddressImpl extends AbstractAddress {
    public static readonly BYTES = 2
    public constructor (bytes: number[]) {
        super(AddressImpl.BYTES, bytes)
    }
}

function expectAllBytesEqual (addr: AbstractAddress, bytes: number[] = TEST_BYTES) {
    expect(addr.length).to.equal(bytes.length)
    for (let i = 0; i < bytes.length; i++) {
        expect(addr.getByte(i)).to.equal(bytes[i])
    }
}

describe('net/address', () => {

  // net/address/index
    describe('AbstractAddress', () => {

        describe('.createFromBytes()', () => {
            it('should return an instance of the given class with the bytes assigned', () => {
                const addr = AbstractAddress.createFromBytes(AddressImpl, TEST_BYTES)
                expect(addr).to.be.an.instanceOf(AddressImpl)
                expectAllBytesEqual(addr)
            })
        })

        describe('.createFromString()', () => {
            it('should create a new address of the given type', () => {
                const addr = AbstractAddress.createFromString(AddressImpl,
                    TEST_BYTES.join(TEST_SEP), TEST_BYTES.length, TEST_SEP, 10)
                expect(addr).to.be.an.instanceOf(AddressImpl)
                expectAllBytesEqual(addr)
            })
        })

    })
})
