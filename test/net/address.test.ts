import { expect } from 'chai'
import 'mocha'

import { OutOfBoundsException } from 'vx-util'
import AbstractAddress from '../../src/net/address'
import HardwareAddress from '../../src/net/address/hardware'
import NetworkV4Address from '../../src/net/address/network4'

const TEST_BYTES = [0b1000, 0xFF]
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

// tslint:disable no-unused-expression
describe('net/address', () => {

  // net/address/index
    describe('AbstractAddress', () => {

        let addr: AddressImpl
        before(() => {
            addr = AbstractAddress.createFromBytes(AddressImpl, TEST_BYTES)
        })

        describe('.createFromBytes()', () => {
            it('should return an instance of the given class with the bytes assigned', () => {
                const addrFromBytes = AbstractAddress.createFromBytes(AddressImpl, TEST_BYTES)
                expect(addrFromBytes).to.be.an.instanceOf(AddressImpl)
                expectAllBytesEqual(addrFromBytes)
            })
        })

        describe('.createFromString()', () => {
            it('should create a new address of the given type from the given string', () => {
                const addrFromStr = AbstractAddress.createFromString(AddressImpl,
                    TEST_BYTES.join(TEST_SEP), TEST_SEP, 10)
                expect(addrFromStr).to.be.an.instanceOf(AddressImpl)
                expectAllBytesEqual(addrFromStr)
            })
            it('should fill in gaps as needed', () => {
                const addrFromStr = AbstractAddress.createFromString(AddressImpl,
                    TEST_BYTES[0] + TEST_SEP + 'x', TEST_SEP, 10)
                expect(addrFromStr.getByte(0)).to.equal(TEST_BYTES[0])
                expect(addrFromStr.getByte(1)).to.equal(0)
            })
        })

        describe('#[Symbol.iterator]()', () => {
            it('should iterate through each byte', () => {
                let i = 0
                for (const byte of addr) {
                    expect(byte).to.equal(TEST_BYTES[i++])
                }
            })
        })

        describe('#getByte()', () => {
            it('should get the byte at the requested index', () => {
                expect(addr.getByte(0)).to.equal(TEST_BYTES[0])
                expect(addr.getByte(1)).to.equal(TEST_BYTES[1])
                expect(addr.getByte(-1)).to.equal(TEST_BYTES[1])
            })

            it('should throw if the index is out of bounds', () => {
                expect(() => addr.getByte(2)).to.throw(OutOfBoundsException)
            })
        })

        describe('#getBytes()', () => {
            it('should return an array containing all bytes', () => {
                const bytes = addr.getBytes()
                expect(bytes[0]).to.equal(TEST_BYTES[0])
                expect(bytes[1]).to.equal(TEST_BYTES[1])
            })
        })

        describe('#toStringArray()', () => {
            it('should return an array with each byte mapped to a string', () => {
                expect(addr.toStringArray()[0]).to.equal(TEST_BYTES[0].toString(10))
                expect(addr.toStringArray(16)[0]).to.equal(TEST_BYTES[0].toString(16))
            })
        })

        describe('#toString()', () => {
            it('should create a string of the bytes joined by a separator', () => {
                expect(addr.toString()).to.equal(TEST_BYTES[0].toString(10) + TEST_BYTES[1].toString(10))
                expect(addr.toString(16, TEST_SEP)).to.equal(TEST_BYTES.map(b => b.toString(16)).join(TEST_SEP))
            })
        })

        describe('#equals()', () => {
            it('should return whether or not all bytes match', () => {
                const addr1 = AbstractAddress.createFromBytes(AddressImpl, TEST_BYTES)
                const addr2 = AbstractAddress.createFromBytes(AddressImpl, [0])
                const addr3 = new HardwareAddress()

                expect(addr.equals(addr1)).to.be.true
                expect(addr.equals(addr2)).to.be.false
                expect(addr.equals(addr3)).to.be.false
            })
        })

        describe('#serialize()', () => {
            it('should return an array of numbers', () => {
                const b = addr.serialize()
                expect(b).to.be.an.instanceOf(Array)
                expect(b[0]).to.be.a('number')
            })
        })

        describe('#toJSON()', () => {
            it('should return an array of numbers', () => {
                const b = addr.toJSON()
                expect(b).to.be.an.instanceOf(Array)
                expect(b[0]).to.be.a('number')
            })
        })
    })

    describe('HardwareAddress', () => {

        let addr: HardwareAddress
        before(() => {
            addr = new HardwareAddress([...TEST_BYTES, ...TEST_BYTES])
        })

        describe('.fromBytes()', () => {
            it('should create a new address from the given bytes', () => {
                const addrFromBytes = HardwareAddress.fromBytes(...TEST_BYTES, ...TEST_BYTES)
                expect(addrFromBytes.equals(addr)).to.be.true
            })
        })

        describe('.fromString()', () => {
            it('should create a new address from the given string', () => {
                const addrFromString = HardwareAddress.fromString('AA:BB')
                expect(addrFromString.getByte(0)).to.equal(0xAA)
                expect(addrFromString.getByte(1)).to.equal(0xBB)
                expect(addrFromString.getByte(2)).to.equal(0)
            })
        })

        describe('#isMulticast() and #isUnicast()', () => {
            it('should return based on the multicast bit', () => {
                expect(addr.isMulticast()).to.be.false
                expect(addr.isUnicast()).to.be.true

                const addr1 = HardwareAddress.fromBytes(HardwareAddress.BIT_MULTICAST)
                expect(addr1.isMulticast()).to.be.true
                expect(addr1.isUnicast()).to.be.false
            })
        })

        describe('#isLocal() and #isGlobal()', () => {
            it('should return based on the local bit', () => {
                expect(addr.isLocal()).to.be.false
                expect(addr.isGlobal()).to.be.true

                const addr1 = HardwareAddress.fromBytes(HardwareAddress.BIT_LOCAL)
                expect(addr1.isLocal()).to.be.true
                expect(addr1.isGlobal()).to.be.false
            })
        })
    })

    describe('Network4Address', () => {
        let addr: NetworkV4Address
        before(() => {
            addr = new NetworkV4Address([...TEST_BYTES, ...TEST_BYTES])
        })

        describe('.fromBytes()', () => {
            it('should create a new address from the given bytes', () => {
                const addrFromBytes = NetworkV4Address.fromBytes(...TEST_BYTES, ...TEST_BYTES)
                expect(addrFromBytes.equals(addr)).to.be.true
            })
        })

        describe('.fromString()', () => {
            it('should create a new address from the given string', () => {
                const addrFromString = NetworkV4Address.fromString('123.210')
                expect(addrFromString.getByte(0)).to.equal(123)
                expect(addrFromString.getByte(1)).to.equal(210)
                expect(addrFromString.getByte(2)).to.equal(0)
            })
        })

        describe('#slash()', () => {
            it('should mask the requested bits', () => {
                const addr0 = NetworkV4Address.fromBytes(255, 255, 255, 255)

                const addr1 = addr0.slash(24)
                expect(addr1.getByte(2)).to.equal(255)
                expect(addr1.getByte(3)).to.equal(0)

                const addr2 = addr0.slash(31)
                expect(addr2.getByte(2)).to.equal(255)
                expect(addr2.getByte(3)).to.equal(254)
            })
        })

        describe('#mask()', () => {
            it('should mask the requested bits', () => {
                const addr0 = NetworkV4Address.fromBytes(255, 255, ...TEST_BYTES)

                const addr1 = addr0.mask(NetworkV4Address.fromBytes(255, 255, 255, 0))
                expect(addr1.getByte(2)).to.equal(TEST_BYTES[0])
                expect(addr1.getByte(3)).to.equal(0)

                const addr2 = addr0.mask(NetworkV4Address.fromBytes(255, 255, 255, 254))
                expect(addr2.getByte(2)).to.equal(TEST_BYTES[0])
                expect(addr2.getByte(3)).to.equal(TEST_BYTES[1] & 254)
            })
        })
    })
})
