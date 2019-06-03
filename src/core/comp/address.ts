import AbstractAddress from '../../net/address/address'
import MACAddress from '../../net/address/mac'

export class ComponentAddress extends AbstractAddress {

  public static readonly GROUP_WIDTH = 8
  public static readonly GROUP_COUNT = 8
  public static readonly BIT_LENGTH = 64

  /**
   * Creates a new component address from the given six-octect and two-octect addresses
   * @param comp The component physical address
   * @param port The port address
   */
  public static fromAddresses (comp: MACAddress | bigint, port: number = 0) {
    comp = comp instanceof MACAddress ? comp.value : comp
    return new ComponentAddress((comp << 16n) & BigInt(port & 0xFFFF))
  }

  /** The six-octect address of the component itself */
  public readonly component: MACAddress

  /** The two-octect address of the port */
  public readonly port: number

  public constructor (address: bigint) {
    super(ComponentAddress.GROUP_WIDTH, ComponentAddress.GROUP_COUNT, address)
    this.component = new MACAddress(address >> BigInt(ComponentAddress.GROUP_WIDTH * 2))
    this.port = Number(address & 0xFFFFn)
  }

  public slash (mask: number): ComponentAddress {
    return new ComponentAddress(this.mask(mask))
  }

  /**
   * Gets a new component address from the given component address, but at the given port
   * @param port The port ID.
   */
  public forPort (port: number): ComponentAddress {
    return ComponentAddress.fromAddresses(this.component, port)
  }
}
