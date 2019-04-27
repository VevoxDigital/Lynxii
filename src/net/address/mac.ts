import { createReadStream } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'
import { AbstractAddress } from './address'

export interface OUI { // tslint:disable-line interface-name
  /** The reserved OUI (i.e. FF-FF-FF) */
  oui: string

  /** The reserved ID (i.e. FFFFFF) */
  id: string

  /** The name of the organization, as is */
  organization: string

  /** The organization's address */
  address: string

  /** The organization's city and postal code */
  locality: string

  /** The organization's country code */
  country: string
}

export class MACAddress extends AbstractAddress {

  /** The group width of MAC addresses */
  public static readonly GROUP_WIDTH = 8

  /** The group count of MAC addresses */
  public static readonly GROUP_COUNT = 6

  /** The number of bits this address occupies */
  public static readonly BITS = 48

  /** A bit mask for the uni-/multi-cast bit */
  public static readonly MASK_CAST = 1n

  /** A bit mask for the global/local bit */
  public static readonly MASK_GLOBAL = 2n

  /** `FF:FF:FF:FF:FF:FF`: The broadcast address */
  public static readonly BROADCAST = MACAddress.fromString('FF:FF:FF:FF:FF:FF')

  // tslint:disable-next-line max-line-length
  public static readonly OUI_LOOKUP_PATTERN = /^([\w-]+)\s+\(hex\)\s+(.+)\n([\w]+)\s+\(base 16\).+(?:\n\s+(.+)(?:\n\s+(.+)(?:\n\s+(\w{2}))?)?)?$/

  /**
   * Looks up the given address against the OUI table
   * @param address The address to look up
   */
  public static async lookup (id: string): Promise<Optional<OUI>> {
    if (!this.ouiMap) {
      this.ouiMap = {}

      const ouis = await new Promise<string[]>(resolve => {
        const rl = createInterface({ input: createReadStream(join(__dirname, '../../oui.txt')) })

        const data: string[] = []
        let linedata: string = ''

        let i = -4 // negative initial to skip the header line
        rl.on('line', line => {
          if (i++ < 0) return
          if (!line.length) {
            i = 0
            data.push(linedata.trim())
            linedata = ''
          }
          linedata += '\n' + line
        })
        rl.on('close', () => resolve(data))
      })

      for (const line of ouis) {
        const data = this.OUI_LOOKUP_PATTERN.exec(line)
        if (!data) {
          if (line.split('\n')[0].endsWith('Private')) {
            const privateOUI = line.substring(0, 8)
            const privateID = privateOUI.replace('-', '')
            this.ouiMap[privateOUI] = {
              address: '',
              country: '',
              id: privateID,
              locality: '',
              organization: 'Private',
              oui: privateOUI
            }
          }

          continue
        }

        const oui = {
          address: data[4] || '',
          country: data[6] || '',
          id: data[3],
          locality: data[5] || '',
          organization: data[2],
          oui: data[1]
        }
        this.ouiMap[oui.id] = oui
      }
    }
    return this.ouiMap[id]
  }

  /**
   * Gets a MAC address from its string counterpart
   * @param address The address string
   * @param sep The address separator
   * @param radix Radix for parsing addresses
   */
  public static fromString (address: string, sep: string = ':', radix: number = 16): MACAddress {
    return new MACAddress(AbstractAddress.valueFromString(address, MACAddress.GROUP_WIDTH,
      MACAddress.GROUP_COUNT, sep, radix))
  }

  /**
   * Gets a MAC address from the given octets
   * @param octets Octets to use
   */
  public static fromOctets (octets: [ number, number, number, number, number, number ]): MACAddress {
    return new MACAddress(AbstractAddress.valueFromGroups(octets.map(BigInt), this.GROUP_WIDTH, this.GROUP_COUNT))
  }

  private static ouiMap?: Dictionary<OUI>

  /** Whether or not this address is global */
  public readonly global: boolean

  /** Whether or not this address is multicast */
  public readonly multicast: boolean

  public constructor (address: bigint | number) {
    super(MACAddress.GROUP_WIDTH, MACAddress.GROUP_COUNT, BigInt(address))

    this.global = (this.groups[0] & MACAddress.MASK_GLOBAL) > 0
    this.multicast = (this.groups[0] & MACAddress.MASK_CAST) > 0
  }

  public slash (mask: number): MACAddress {
    return new MACAddress(this.mask(mask))
  }

  /**
   * Looks up this address against the OUI table
   */
  public lookup (): Promise<Optional<OUI>> {
    return this.global ? MACAddress.lookup(this.toString(16, '')) : Promise.resolve(undefined)
  }
}
