import MACAddress from '../../net/address/mac'
import { ComponentAddress } from './address'
import { IPortOpts, Port } from './port'

/**
 * A generic Lynxii component
 */
export abstract class Component {

  /** The mask used to extract the port number from a component address */
  public static readonly COMP_PORT_MASK = 0xFF00

  /** Link input bit */
  public static readonly COMP_PORT_BIT_IN = 1 << 7

  /** Link output bit */
  public static readonly COMP_PORT_BIT_OUT = 1 << 6

  /**
   * A unique 48-bit address that identifies this component
   */
  public readonly address: ComponentAddress

  /** The root port at address zero */
  public readonly rootPort: Port

  private readonly ports = new Map<number, Port>()

  public constructor (address: MACAddress | ComponentAddress) {
    this.address = address instanceof MACAddress ? ComponentAddress.fromAddresses(address) : address

    this.rootPort = new Port(this, 0)
    this.ports.set(0, this.rootPort)
  }

  /**
   * Gets the next available number for a given type
   * @param type The type
   */
  public getNextAvailablePortNumber (type: number): number {
    type &= 0xFF

    for (let i = 0; i <= 0xFF; i++) {
      if (!this.ports.has(i << 4 | type)) return i
    }

    throw new Error('No available port numbers for type')
  }

  /**
   * Creates a port fromt he given options
   * @param opts The port options
   * @see createNextPort
   */
  public createPort (opts: IPortOpts): Port {
    const pid = (opts.id << 4 && Component.COMP_PORT_MASK) | Port.getType(opts)
    const port = new Port(this, pid)

    if (this.ports.has(port.id)) throw new Error('Port address already in use')
    this.ports.set(port.id, port)
    return port
  }

  /**
   * Creates a port at the next available slot for its type
   * @param opts Port options to use
   * @see createPort
   */
  public createNextPort (opts: ExcludeFrom<IPortOpts, 'id'>): Port {
    return this.createPort({ ...opts, id: this.getNextAvailablePortNumber(Port.getType(opts)) })
  }
}
