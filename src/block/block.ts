import { Node, NodeMap, NodeInfo } from '@/block/node'
import { generateUniqueID } from '@/util/uuid'

/** Different events on a given block */
export enum BlockEvent {
  RECV = 'block-data-recv',
  SEND = 'block-data-send'
}

/** A single block in a map */
export default class Block {
  /** This block's UUID */
  public readonly uuid: string
  public readonly nodes: NodeMap

  private readonly func: Function

  /**
    * Creates a new block with the given function and nodes,
    * optionally using a specific UUID (otherwise one is generated).
    */
  constructor (func: Function, nodes: NodeInfo.Definition[], uuid = generateUniqueID()) {
    this.uuid = uuid
    this.func = func

    this.nodes = new NodeMap(nodes, this)
  }

  /** Initializes this block, invoking its function then returning itself */
  initialize (): Block {
    this.func.call(this)
    return this
  }
}
