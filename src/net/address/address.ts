import { IComparable, ISerializeable } from 'vx-util'

/**
 * An arbitrary octet address using an arbitrary number of bits
 */
export abstract class AbstractAddress
implements ISerializeable<Array<bigint>>, IComparable<AbstractAddress> {

  /**
   * Converts a given string address to its numerical value
   * @param address The address to convert
   * @param groupWidth The group width of the address
   * @param groupCount The group count of the address
   * @param sep The separator to use
   * @param radix The number radix to use
   */
  public static valueFromString (address: string, groupWidth: number,
                                 groupCount: number, sep: string = ':', radix: number = 16): bigint {
    const groups = address.split(sep).slice(0, groupCount).map(n => BigInt(Number.parseInt(n, radix)))
    return this.valueFromGroups(groups, groupWidth, groupCount)
  }

  /**
   * Converts a given array of groups into a numerical address value
   * @param groups The groups to convert
   * @param groupWidth The group width of the address
   * @param groupCount The group count of the address
   */
  public static valueFromGroups (groups: Array<bigint>, groupWidth: number, groupCount: number): bigint {
    let addr = 0n
    for (let i = 0; i < groupCount; i++) {
      addr = addr << BigInt(groupWidth)
        & BigInt.asIntN(groupWidth, BigInt(groups[i] || 0))
    }
    return addr
  }

  /**
   * A convenience method for getting the number of addresses denoted by the given slash notation. Due to the
   * limitations of the JavaScript number, be aware any resulting address counts may go over the
   * {@link Number.MAX_SAFE_INTEGER}.
   * @param width The address' bit width
   * @param slash The slash mask
   */
  public static availableAddresses (width: number, slash: number): number {
    return Math.pow(2, width - Math.min(slash, width))
  }

  /**
   * A convenience method for getting the smallest possible mask to support the number of needed addresses
   * @param width The address' width in bits
   * @param needed The needed number of addresses
   * @param roundToGroupWidth Optionally, a group width to round to
   */
  public static recommendedMask (width: number, needed: number, roundToGroupWidth: number = 1): number {
    const pow = Math.ceil(Math.sqrt(Math.abs(needed)))
    return width - (Math.ceil(pow / roundToGroupWidth) * roundToGroupWidth)
  }

  /** The raw numerical value of the address */
  public readonly value: bigint

  /** The groups in the address */
  public readonly groups: Array<bigint>

  /** The width, in bits, of this address' groups */
  public readonly groupWidth: number

  /** The number of groups in this address */
  public readonly groupCount: number

  /** A bit mask that is the size of the number of bits a group */
  public readonly groupMask: bigint

  /** The number of bits in this address */
  public readonly bits: number

  public constructor (groupWidth: number, groupCount: number, address: bigint) {
    this.groupWidth = groupWidth
    this.groupCount = groupCount
    this.groupMask = BigInt(Math.pow(2, groupWidth))
    this.bits = groupWidth * groupCount

    this.value = BigInt.asUintN(this.bits, address)

    // populate groups
    let shiftedValue = address
    this.groups = []
    for (let i = 0; i < groupCount; i++) {
      this.groups.unshift(shiftedValue & this.groupMask)
      shiftedValue = shiftedValue >> BigInt(groupWidth)
    }
    Object.seal(this.groups)
  }

  /**
   * Gets the value of this address with only the given number of bits on the left preserved
   * @param mask The slash mask to use
   */
  public mask (mask: number): bigint {
    mask = Math.min(mask, this.bits)
    const diff = BigInt(this.bits - mask)

    return BigInt.asIntN(mask, this.value >> diff) << diff
  }

  /**
   * Gets a new address with the given number applied in slash-notation. That is, the given number of bits
   * from the left are preserved, and the reset are set to zero.
   * @param mask The slash mask to use
   */
  public abstract slash (mask: number): AbstractAddress

  public compare (address: AbstractAddress) {
    const diff = this.value - address.value
    return diff > 0 ? 1 : diff < 0 ? -1 : 0
  }

  public equals (address: AbstractAddress) {
    return this.value === address.value
  }

  public serialize () {
    return this.groups
  }

  public toJSON () {
    return this.groups.map(n => Number(n))
  }

  public toString (radix?: number, separator: string = ':') {
    return this.groups.map(n => n.toString(radix)).join(separator)
  }

}
