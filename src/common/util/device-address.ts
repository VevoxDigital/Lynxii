
import 'vx-util'
import * as assert from 'assert'
import errorList from '../errors'
import { numberToString } from './'

/**
 * A device address is a (supposedly) unique 64-bit unsigned integer (to what extent
 * JavaScript allows such things) that identifies a device in the pool. The first 48 bits
 * of physical devices will simply be the MAC address of the device, while logical devices
 * get a six-octet address that is somewhat similar to a MAC.
 *
 * The remaining (and least-significant) 16 bits are an "instance ID" of sorts, for when
 * multiple instances of the same logical device exists, giving a maximum of `FFFF` (65535)
 * logical devices of the same type. On physical devices, this is always zero.
 *
 * Logical device addresses are similar to MACs, in that they have OUI- and NIC-specific
 * octet triplets, but with the U/L bit (the second least-significant of the first octet)
 * set to 1 rather than 0. Both kinds of devices should be multicast; that is, the least-significant
 * bit of the first octet is 1. Unicast devices are purely internal to Lynxii.
 *
 * The OUI of logical devices is a unique value specified by the developer of the device,
 * much like MACs. So long as the aforementioned bits are correctly set, this value may be
 * anything. The next three octets are a "model number" of sorts that, again, could be
 * whatever the developer chooses. The final two octets are assigned by the host, described
 * above.
 *
 * Also much like MACs, these addresses are represented as hex characters, using colons
 * to separate octets. The only difference being that there are eight octets rather than
 * six.
 *
 * For example, `01:24:68:10:AB:CD:00:00` could be a theoretical physical device, while
 * `03:00:00:00:00:00:02:6F` is a perfectly valid logical device. In fact, this would
 * be instance `026F` (623) of Lynxii's generic "black-box" block.
 *
 * **Note:**
 * In the case of developers who also vend physical devices, we suggest re-using the OUI of
 * your current universal MACs, but flip the U/L bit.
 */
export default class DeviceAddress {

  /** The pattern used to validate a device address */
  public static readonly ADDRESS_PATTERN = /[0-9A-F]{12}/

  /** A bit mask for checking the U/L bit */
  public static readonly BIT_MASK_UL = 0x020000

  /** A bit mask for checking the cast bit */
  public static readonly BIT_MASK_CAST = 0x010000

  /** The maximum device ID */
  public static readonly MAX_DEVICE_ID = 0xFFFF

  /**
   * Creates a device address from a physical MAC address
   * @param macAddress A hex string representing the MAC address
   */
  public static createForPhysicalDevice (macAddress: string): DeviceAddress {
    // add on the zeros and parse to binary, then instance
    return this.verifyULBit(
      this.verifyDeviceIsMulticast(new this(macAddress, 0)),
      true)
  }

  /**
   * Create a new address for a logical device, using the unique device ID
   * @param deviceID The ID of the device
   */
  public static async createForLogicalDevice (deviceID: string): Promise<DeviceAddress> {
    // TODO lookup the device in the database to get instance ID
    // for now, randomly pick something

    // Also, await the RNG so the linter stops complaining. in the
    // future, this will access the database and need to be async
    const instanceID = await Math.floor(Math.random() * this.MAX_DEVICE_ID)

    // tack on the instance ID and create from it
    return this.verifyULBit(
      this.verifyDeviceIsMulticast(new this(deviceID, instanceID)),
      false)
  }

  // verification that the device is multicast when it should be,
  // since the constructor does not check this
  private static verifyDeviceIsMulticast (da: DeviceAddress): DeviceAddress {
    assert(!da.isInternal, errorList.DEVICE_ADDRESS_IS_UNICAST)
    return da
  }

  // verification that the device has the correct UL bit
  private static verifyULBit (da: DeviceAddress, shouldBePhysical: boolean): DeviceAddress {
    assert(da.isPhysicalDevice === shouldBePhysical, errorList.DEVICE_ADDRESS_INCORRECT_UL)
    return da
  }

  /** The OUI bits of the address */
  public readonly oui: number

  /** The NIC bits of the address */
  public readonly nic: number

  /** The instance ID of this address */
  public readonly instance: number

  public readonly ouiStr: string

  public readonly nicStr: string

  public readonly instanceStr: string

  /** Whether or not this address represents a physical device */
  public readonly isPhysicalDevice: boolean

  /** Whether or not this address represents an internal device */
  public readonly isInternal: boolean

  // actually build from the address, a hex string
  private constructor (address: string, instanceID: number) {
    assert(DeviceAddress.ADDRESS_PATTERN.exec(address), errorList.DEVICE_ID_INVALID_FORMAT)
    assert(instanceID < DeviceAddress.MAX_DEVICE_ID, errorList.DEVICE_INSTANCE_ID_TOO_LARGE)
    assert(instanceID >= 0, errorList.DEVICE_INSTANCE_ID_NEGATIVE)

    this.oui = Number.parseInt(address.substring(0, 6), 16)
    this.nic = Number.parseInt(address.substring(3), 16)
    this.instance = instanceID

    this.isPhysicalDevice = !(this.oui & DeviceAddress.BIT_MASK_UL)
    this.isInternal = !(this.oui & DeviceAddress.BIT_MASK_CAST)

    this.ouiStr = numberToString(this.oui, 16, 6)
    this.nicStr = numberToString(this.nic, 16, 6)
    this.instanceStr = numberToString(this.instance, 16, 4)
  }

  /**
   * Gets the numerical representation of this address
   */
  public toNumber (includeInstanceID: boolean = true): number {
    return Number.parseInt(this.ouiStr + this.nicStr + (includeInstanceID ? this.instanceStr : ''), 16)
  }

  /**
   * Creates a string representation of this address
   * @param radix The radix of the string output, defaults to 16
   */
  public toString (radix: number = 16, includeInstanceID: boolean = true): string {
    return radix === 16
      ? this.ouiStr + this.nicStr + (includeInstanceID ? this.instanceStr : '')
      : numberToString(this.toNumber(includeInstanceID), radix)
  }

  /**
   * Creates a string representation of this address, with octet separators
   * @param sep The separator to use, defaults to a colon (:)
   */
  public toSeparatedString (sep: string = ':', includeInstanceID?: boolean): string {
    const octets = [ ]
    const str = this.toString(16, includeInstanceID)

    let pos = 0
    while (pos < str.length) {
      octets.push(str.substring(pos, pos + 2))
      pos += 2
    }

    return octets.join(sep)
  }
}