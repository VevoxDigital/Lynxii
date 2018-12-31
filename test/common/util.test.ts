
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { DeviceAddress, errorList, numberToString } from 'lynxii-common'
import 'mocha'

chai.use(chaiAsPromised)
const { expect } = chai

describe('common/util', function () {
  describe('(utility functions)', function () {
    describe('numberToString(number, number?, number?)', function () {
      const pad = 3
      const num = 0xF // 15
      const numStr10 = '15'
      const numStr10P = '015'
      const numStr16 = 'f'
      const numStr16P = '00f'

      it ('should output with radix 10 by default', function () {
        expect(numberToString(num)).to.equal(numStr10)
      })
      it ('should output with the given radix if one is provided', function () {
        expect(numberToString(num, 16)).to.equal(numStr16)
      })
      it ('should output with radix 10 by default, even when padding is given', function () {
        expect(numberToString(num, undefined, pad)).to.equal(numStr10P)
      })
      it ('should output with the given radix and padding', function () {
        expect(numberToString(num, 16, pad)).to.equal(numStr16P)
      })
    })
  })

  describe('DeviceAddress', function () {
    let physicalDA: DeviceAddress
    let logicalDA: DeviceAddress

    const ADDR_OUI_PHYSICAL_SEP = '01:00:00'
    const ADDR_NIC_SEP = '01:23:45'

    const ADDR_OUI_PHYSICAL = '010000'
    const ADDR_OUI_LOGICAL = '030000'
    const ADDR_NIC = '012345'

    const ADDR_PHYSICAL_VALUE = 1099511702341
    const ADDR_PHYSICAL_INSTANCE_VALUE = 72057598924619780

    before(async function () {
      physicalDA = DeviceAddress.createForPhysicalDevice(ADDR_OUI_PHYSICAL + ADDR_NIC)
      logicalDA = await DeviceAddress.createForLogicalDevice(ADDR_OUI_LOGICAL + ADDR_NIC)
    })

    describe('static createForPhysicalDevice(string)', function () {
      it ('should create an address that is physical', function () {
        expect(physicalDA).to.be.an.instanceOf(DeviceAddress)
        expect(physicalDA).to.have.property('isPhysicalDevice').that.equals(true)
        expect(physicalDA).to.have.property('instance').that.equals(0)
        expect(physicalDA).to.have.property('oui').that.equals(Number.parseInt(ADDR_OUI_PHYSICAL, 16))
        expect(physicalDA).to.have.property('nic').that.equals(Number.parseInt(ADDR_NIC, 16))
      })
      it ('should fail if the OUI is local', function () {
        expect(() => DeviceAddress.createForPhysicalDevice(ADDR_OUI_LOGICAL + ADDR_NIC))
          .to.throw(errorList.DEVICE_ADDRESS_INCORRECT_UL)
      })
    })

    describe('static createForLogicalDevice(string)', function () {
      it ('should create an address that is logical', function () {
        expect(logicalDA).to.be.an.instanceOf(DeviceAddress)
        expect(logicalDA).to.have.property('isPhysicalDevice').that.equals(false)
        expect(logicalDA).to.have.property('instance').that.is.greaterThan(0)
        expect(logicalDA).to.have.property('oui').that.equals(Number.parseInt(ADDR_OUI_LOGICAL, 16))
        expect(logicalDA).to.have.property('nic').that.equals(Number.parseInt(ADDR_NIC, 16))
      })
      it ('should fail is OUI is universal', function () {
        expect(DeviceAddress.createForLogicalDevice(ADDR_OUI_PHYSICAL + ADDR_NIC))
          .to.be.rejectedWith(errorList.DEVICE_ADDRESS_INCORRECT_UL)
      })
    })

    describe('toNumber(boolean?)', function () {
      it ('should output a number with an instance ID by default', function () {
        expect(physicalDA.toNumber()).to.equal(ADDR_PHYSICAL_INSTANCE_VALUE)
      })
      it ('should output a number without an instance ID when asked', function () {
        expect(physicalDA.toNumber(false)).to.equal(ADDR_PHYSICAL_VALUE)
      })
    })

    describe('toString(number?, boolean?)', function () {
      it ('should just append strings if radix is default', function () {
        expect(physicalDA.toString()).to.equal(ADDR_OUI_PHYSICAL + ADDR_NIC + '0000')
      })
      it ('should just append strings if radix is default, even without instanceID', function () {
        expect(physicalDA.toString(undefined, false)).to.equal(ADDR_OUI_PHYSICAL + ADDR_NIC)
      })
      it ('should actually parse numbers for non-default radix', function () {
        expect(physicalDA.toString(10)).to.equal(ADDR_PHYSICAL_INSTANCE_VALUE.toString(10))
      })
    })

    describe('toSeparatedString(string?, boolean?', function () {
      it ('should be the same string as toString, but with a separator', function () {
        expect(physicalDA.toSeparatedString()).to.equal(ADDR_OUI_PHYSICAL_SEP + ':' + ADDR_NIC_SEP + ':00:00')
        expect(physicalDA.toSeparatedString(undefined, false)).to.equal(ADDR_OUI_PHYSICAL_SEP + ':' + ADDR_NIC_SEP)
      })

      it ('should accept any separator string', function () {
        expect(physicalDA.toSeparatedString(', ', false)).to.equal((ADDR_OUI_PHYSICAL_SEP + ':' + ADDR_NIC_SEP).replace(/:/g, ', '))
      })
    })
  })
})
