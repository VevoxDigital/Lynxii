import { NodeMap, NodeInfo } from 'server/block/node'
import { generateUniqueID, Point, idFormat as uuidFormat } from 'server/util'
import * as assert from 'assert'

export namespace BlockData {
  /** Data that is used to describe a block */
  export interface Descriptor {
    /** An array of nodes for the block */
    nodes: NodeInfo.Definition[]

    /** The function called to set up the block */
    setupFunction: Function

    /** The default value for the display name */
    defaultDisplayName: string

    /** Any custom fields for the block */
    customFields: Field[]

    /** Whether or not this block can have multiple instances */
    canHaveMultipleInstances: boolean
  }

  /** Metadata for a given block */
  export interface Meta {
    /** A user-displayable name for this block */
    displayName: string

    /** The block's position */
    position: Point
  }

  export interface Field {

  }

  /** Different events on a given block */
  export enum Event {
    RECV = 'block-data-recv',
    SEND = 'block-data-send'
  }
}

/** A matching pattern for parsing a block's package */
export const packagePattern = /^((?:[a-z0-9-]+\.)+)([a-z0-9-]+)$/

/** A single block in a map */
export default class Block {
  /**
    * Creates a block from a descriptor
    * @param id   The fully-quallified ID of this block
    * @param data The descriptor holding the data
    * @param uuid The UUID to use
    * @param pos  The location for this block in the map
    */
  static from (id: string, data: BlockData.Descriptor, uuid = generateUniqueID(), pos?: Point): Block {
    assert(uuid.match(uuidFormat), 'Given UUID is not a valid v4 UUID, got: ' + uuid)

    const idMatch = packagePattern.exec(id)
    assert(!!idMatch, 'ID does not match valid pattern')

    let [ packageName, name ] = idMatch.slice(1)
    packageName = packageName.substring(0, packageName.length - 1)

    return new Block(name, packageName, uuid, data, pos)
  }

  /** Creates the default block metadata based on the given information */
  static createDefaultMeta (data: BlockData.Descriptor, pos?: Point): BlockData.Meta {
    return {
      displayName: data.defaultDisplayName,
      position: pos || { x: 0, y: 0 }
    }
  }

  /** This block's UUID */
  public readonly uuid: string

  /** A mapping of the nodes for this block */
  public readonly nodes: NodeMap

  /** The internal name of this block */
  public readonly name: string

  /** The internal package name of this block */
  public readonly packageName: string

  /** Client-only metadata for this block */
  public readonly meta: BlockData.Meta

  private readonly setupFunction: Function

  /**
    * Creates a new block with the given name, package name, and UUID using
    * the given descriptor.
    */
  private constructor (
    name: string,
    packageName: string,
    uuid: string,
    descriptor: BlockData.Descriptor,
    pos?: Point
  ) {
    this.uuid = uuid
    this.name = name
    this.packageName = packageName

    this.setupFunction = descriptor.setupFunction
    this.meta = Block.createDefaultMeta(descriptor, pos)

    this.nodes = new NodeMap(descriptor.nodes, this)
  }

  /** This block's fully-quallified ID */
  get id () {
    return `${this.packageName}.${this.name}`
  }

  /** Initializes this block, invoking its function then returning itself */
  initialize (): Block {
    this.setupFunction.call(this)
    return this
  }
}
