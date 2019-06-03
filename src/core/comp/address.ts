import AbstractAddress from '../../net/address/address'
import MACAddress from '../../net/address/mac'

export class ComponentAddress extends AbstractAddress {

  public static readonly GROUP_WIDTH = 8
  public static readonly GROUP_COUNT = 8
  public static readonly BIT_LENGTH = 64

  /** Number of bits to shift to make the OUI the least significant digits */
  public static readonly SHIFT_OUI = ComponentAddress.GROUP_WIDTH * 5

  /** Number of bits to shify to make the NIC the least significant digits */
  public static readonly SHIFT_NIC = ComponentAddress.GROUP_WIDTH * 2

  /** Number of bits to shift to make the TYPE the least significant digits */
  public static readonly SHIFT_TYP = ComponentAddress.GROUP_WIDTH

  /** Number of bits to shift to make the NUMBER the least significant digits */
  public static readonly SHIFT_NUM = 0

  /** Mask for isolating the OUI */
  public static readonly MASK_OUI = 0xFFFFFFn << BigInt(ComponentAddress.SHIFT_OUI)

  /** Mask for isolating the NIC */
  public static readonly MASK_NIC = 0xFFFFFFn << BigInt(ComponentAddress.SHIFT_NIC)

  /** Mask for isloating the TYPE */
  public static readonly MASK_TYP = 0xFFn << BigInt(ComponentAddress.SHIFT_TYP)

  /** Mask for isolating the NUMBER */
  public static readonly MASK_NUM = 0xFFn << BigInt(ComponentAddress.SHIFT_NUM)

  public static readonly MASK_ID = ComponentAddress.MASK_TYP | ComponentAddress.MASK_NUM
  public static readonly MASK_MAC = ComponentAddress.MASK_OUI | ComponentAddress.MASK_NIC

  /**
   * Creates a new component address from the given six-octect and two-octect addresses
   * @param comp The component physical address
   * @param port The port address
   */
  public static fromAddresses (comp: MACAddress | bigint, port: number = 0) {
    comp = comp instanceof MACAddress ? comp.value : comp
    return new ComponentAddress((comp << BigInt(ComponentAddress.SHIFT_NIC))
      & (BigInt(port) & ComponentAddress.MASK_ID))
  }

  public readonly OUI: bigint
  public readonly NIC: bigint
  public readonly TYP: bigint
  public readonly NUM: bigint

  /** The six-octect address of the component itself */
  public readonly componentMAC: MACAddress

  /** The two-octect address of the port */
  public readonly id: bigint

  public constructor (address: bigint) {
    super(ComponentAddress.GROUP_WIDTH, ComponentAddress.GROUP_COUNT, address)
    this.OUI = address & ComponentAddress.MASK_OUI
    this.NIC = address & ComponentAddress.MASK_NIC
    this.TYP = address & ComponentAddress.MASK_TYP
    this.NUM = address & ComponentAddress.MASK_NUM

    this.componentMAC = new MACAddress(address >> BigInt(ComponentAddress.SHIFT_TYP + ComponentAddress.SHIFT_NUM))
    this.id = this.TYP | this.NUM
  }

  public slash (mask: number): ComponentAddress {
    return new ComponentAddress(this.mask(mask))
  }

  /**
   * Gets a new component address from the given component address, but at the given port
   * @param port The port ID.
   */
  public forPort (port: number): ComponentAddress {
    return ComponentAddress.fromAddresses(this.componentMAC, port)
  }
}
