import { EventEmitter } from 'events'
import { default as Block, BlockData } from './block'

export namespace NodeInfo {
  /** The direction a node is acting in */
  export enum Direction {
    INPUT,
    OUTPUT
  }

  /** The type of data on a node */
  export enum Type {
    BOOLEAN,
    NUMBER,
    STRING,
    OBJECT
  }

  export interface Definition {
    direction: NodeInfo.Direction
    type: NodeInfo.Type

    validator?: Function
  }

  export interface NodeMapNodes extends Array<Node> {
    [index: number]: Node
  }
}

export class NodeValueValidationError extends Error {

}

/** A mapping for a block's nodes */
export class NodeMap {
  private readonly inputs: NodeInfo.NodeMapNodes
  private readonly outputs: NodeInfo.NodeMapNodes

  constructor (nodes: NodeInfo.Definition[], block: Block, sendHandler: Function) {
    this.inputs = [ ]
    this.outputs = [ ]

    const arrayMapping = {
      [NodeInfo.Direction.INPUT]: this.inputs,
      [NodeInfo.Direction.OUTPUT]: this.outputs
    }

    for (const nodeDef of nodes) {
      const array = arrayMapping[nodeDef.direction]
      if (array) {
        const node = new Node(nodeDef, block, array.length)
        array.push(node)

        node.on(BlockData.Event.SEND, data => sendHandler.call(block, array.length - 1, data))
      }
    }
  }

  /** the number of input nodes */
  get inputCount (): number {
    return this.inputs.length
  }

  /** The number of output nodes */
  get outputCount (): number {
    return this.outputs.length
  }

  /** Gets an input node by its index */
  getInput (index: number): Node {
    return this.inputs[index]
  }

  /** Gets an output node by its index */
  getOutput (index: number): Node {
    return this.outputs[index]
  }
}

/** A singular node on a given Block */
export class Node extends EventEmitter implements NodeInfo.Definition {
  public readonly block: Block
  public readonly index: number
  public readonly direction: NodeInfo.Direction
  public readonly type: NodeInfo.Type
  public readonly validator: Function

  private value: any

  constructor (def: NodeInfo.Definition, block: Block, index: number) {
    super()

    this.block = block
    this.index = index
    this.direction = def.direction
    this.type = def.type
    this.validator = def.validator
  }

  /** Validates the given value, returning whether or not it is valid */
  validate (value = this.value): boolean {
    const type = NodeInfo.Type[this.type].toLowerCase()
    return typeof value === type && this.validator
      ? !!this.validator(value)
      : true
  }

  /**
    * Sends the following data out of this node
    * @param data The data to send
    */
  send (data) {
    if (this.direction !== NodeInfo.Direction.OUTPUT) throw new Error('cannot send data from non-output node')
    this.emit(BlockData.Event.SEND, data)
  }

  /** Recieves the given data */
  recieve (data) {
    if (this.direction !== NodeInfo.Direction.INPUT) throw new Error('cannot recieve data from non-input node')
    this.emit(BlockData.Event.RECV, data)
  }
}
