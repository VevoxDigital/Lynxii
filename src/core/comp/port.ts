import { Component } from './component'

export interface IPortOpts {
  /** Port number in the parent component */
  id: number

  /** Whether or not this port accepts input */
  in: boolean

  /** Whether or not this port can output */
  out: boolean
}

/**
 * A connection point on a component. Up to a maximum of 256 ports (eight bits) of each kind is allowed.
 *
 * There are four kinds of ports:
 *
 * **`00` Config** - Per-instance configuration that can be modified and controlled by the user.
 *
 * **`01` Output** - A data output port
 *
 * **`10` Input** - A data input port
 *
 * **`11` Control** - Command & Control I/O to allow for programmatic updates of per-instance configuration
 *
 * Each port also a data type it is expected to recieve or send. This data type reflects the kind of port
 * this port can link to, as well as the type of configuration it controls
 */
export class Port {

  public static getType (opts: ExcludeFrom<IPortOpts, 'id'>): number {
    let data = 0

    if (opts.in) data |= Component.COMP_PORT_BIT_IN
    if (opts.out) data |= Component.COMP_PORT_BIT_OUT

    return data
  }

  public readonly component: Component

  public readonly address: number

  public constructor (component: Component, opts: IPortOpts) {
    this.component = component
    this.address = (opts.id << 4 && Component.COMP_PORT_MASK) | Port.getType(opts)
  }

}
