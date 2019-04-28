import { resolve4 } from 'dns'
import { promisify } from 'util'
import AbstractAddress from './address'

/**
 * A 32-bit IPv4 address
 */
export default class INetAddress4 extends AbstractAddress {
  /** The maximum value for an address */
  public static readonly MAX = 0xFFFFFFFF

  /** The group width of v4 addresses */
  public static readonly GROUP_WIDTH = 8

  /** The group count of v4 addresses */
  public static readonly GROUP_COUNT = 4

  /** The number of bits this address occupies */
  public static readonly BITS = 32

  /** `0.0.0.0`: The "any particular address" address */
  public static readonly ANY = new INetAddress4(0)

  /** `255.255.255.255`: The broadcast address */
  public static readonly BROADCAST = new INetAddress4(INetAddress4.MAX)

  /** `127.0.0.1`: Localhost address */
  public static readonly LOCALHOST = INetAddress4.fromOctets([127, 0, 0, 1])

  /** `10.0.0.0`: The class-A or `/8` subnet address, allowing up to 16,777,215 addresses */
  public static readonly SUBNET_CLASS_A = INetAddress4.fromOctets([10])

  /** `127.16.0.0`: The class-B or `/16` subnet address, allowing up to 65,535 addresses */
  public static readonly SUBNET_CLASS_B = INetAddress4.fromOctets([127, 16])

  /** `192.168.0.0`: The class-C or `/24` subnet address, allowing up to 255 addresses */
  public static readonly SUBNET_CLASS_C = INetAddress4.fromOctets([192, 168])

  /**
   * Gets an IPv4 address from its string counterpart
   * @param address The address string
   * @param sep The address separator
   * @param radix Radix for parsing addresses
   */
  public static fromString (address: string, sep: string = '.', radix: number = 10): INetAddress4 {
    return new INetAddress4(AbstractAddress.valueFromString(address, INetAddress4.GROUP_WIDTH,
      INetAddress4.GROUP_COUNT, sep, radix))
  }

  /**
   * Gets an IPv4 address from the given octets
   * @param octets Octets to use
   */
  public static fromOctets (octets: [ number, number?, number?, number? ]): INetAddress4 {
    return new INetAddress4(AbstractAddress.valueFromGroups(octets.map(BigInt), this.GROUP_WIDTH, this.GROUP_COUNT))
  }

  /**
   * Attempts to make a DNS resolution for the given hostname, returning an array of addresses resolved
   * @param hostname The hostname to resolve
   */
  public static async resolve (hostname: string): Promise<INetAddress4[]> {
    return (await promisify(resolve4)(hostname)).map(s => INetAddress4.fromString(s))
  }

  public constructor (address: bigint | number) {
    super(INetAddress4.GROUP_WIDTH, INetAddress4.GROUP_COUNT, BigInt(address))
  }

  public slash (mask: number): INetAddress4 {
    return new INetAddress4(this.mask(mask))
  }

  /**
   * Returns whether or not the given address is a member of a subnet defined by this address and a slash mask.
   * @param address The address to check
   */
  public memberOf (address: INetAddress4, mask: number): boolean {
    return this.slash(mask).equals(address.slash(mask))
  }

  public toString (radix?: number, sep: string = '.') {
    return super.toString(radix, sep)
  }
}
