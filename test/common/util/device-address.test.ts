
import 'mocha'
import { expect } from 'chai'
import { DeviceAddress, errorList } from 'lynxii-common'

describe('common/util', function () {

  describe('DeviceAddress', function () {

    // const ADDR_OUI_PHYSICAL_SEP = '01:00:00'
    // const ADDR_OUI_LOGICAL_SEP = '03:00:00'
    // const ADDR_NIC_SEP = '12:34:56'

    const ADDR_OUI_PHYSICAL = '010000'
    const ADDR_OUI_LOGICAL = '030000'
    const ADDR_NIC = '123456'

    describe('static createForPhysicalDevice(string)', function () {

      it ('should create an address that is physical', function () {
        const da = DeviceAddress.createForPhysicalDevice(ADDR_OUI_PHYSICAL + ADDR_NIC)
        expect(da).to.be.an.instanceOf(DeviceAddress)
        expect(da).to.have.property('isPhysicalDevice').that.equals(true)
        expect(da).to.have.property('instance').that.equals(0)
        expect(da).to.have.property('oui').that.equals(Number.parseInt(ADDR_OUI_PHYSICAL, 16))
        expect(da).to.have.property('nic').that.equals(Number.parseInt(ADDR_NIC, 16))
      })

      it ('should fail if the OUI is local', function () {
        expect(() => DeviceAddress.createForPhysicalDevice(ADDR_OUI_LOGICAL + ADDR_NIC))
          .to.throw(errorList.DEVICE_ADDRESS_INCORRECT_UL)
      })
    })

  })

})
