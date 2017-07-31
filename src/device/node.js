'use strict'

const assert = require('assert')

const { EventEmitter } = require('events')
const { Enum } = require('enumify')

class NodeType extends Enum { }
NodeType.initEnum({
  'ANY': {
    get type () { return },
    get default () { return }
  },
  'BOOLEAN': {
    get type () { return 'boolean' },
    get default () { return false }
  },
  'NUMBER': {
    get type () { return 'number' },
    get default () { return 0 }
  },
  'STRING': {
    get type () { return 'string' },
    get default () { return '' }
  }
})
exports.NodeType = NodeType

/**
  * @class
  * A node point on a device
  */
class DeviceNode extends EventEmitter {
  /**
    * @constructor
    * Creates a new DeviceNode with the given type and optional max connection count
    *
    * @param {enum.TYPE}  type          The type of connection
    * @param {number}     [connections] The maximum number of connections to this node, or `0` for unlimited
    */
  constructor (type, connections = 0) {
    super()
    assert.ok(type instanceof NodeType, `Node type '${type}' must be one of NodeType`)
    assert.strictEqual(typeof connections, 'number', 'Connection count must be a number')

    connections = Math.max(connections, 0) // make sure connection count is >= 0

    // constants
    Object.defineProperty(this, 'type', { value: type, enumerable: true })
    Object.defineProperty(this, 'maxConnections', { value: connections || Number.MAX_SAFE_INTEGER, enumerable: true })

    // private variables
    Object.defineProperty(this, '_enabled', { value: true, enumerable: false, writable: true })
    Object.defineProperty(this, '_state', { value: type.default, enumerable: false, writable: true })
    Object.defineProperty(this, '_connections', { value: [ ] })

    this.on(Util.DeviceEvent.DATA, data => {
      if (this.isValid(data)) this._state = data
    })
  }

  isValid (data) {
    return this.type === NodeType.ANY || typeof data === this.type.type
  }

  /**
    * @function
    * Gets the current state of the device
    * @return {*} The state
    */
  get state () {
    return this._state
  }

  /**
    * @function
    * Sets whether or not this node is enabled
    * @param {*} e A truthy or falsey value to set
    */
  set enabled (e) {
    this._enabled = !!e
  }

  /**
    * @function
    * Gets the enabled state of this node
    * @return {boolean} Whether or not this node is enabled
    */
  get enabled () {
    return this._enabled
  }

  /**
    * @function
    * Gets a copy of the connections to this node
    * @return {Array<DeviceNode>} The connections
    */
  get connections () {
    return [ ...this._connections ]
  }

  /**
    * @function
    * Connects the given node to this one.
    * @param {DeviceNode} node The node to connect
    */
  connect (node) {
    assert.ok(node instanceof DeviceNode, 'Connection node must be a DeviceNode')
    if (this._connections.length < this.maxConnections && node.connections.length < node.maxConnections &&
      this._connections.indexOf(node) < 0 && node._connections.indexOf(this) < 0) {
      this._connections.push(node)
      node._connections.push(this)

      this.emit(Util.DeviceEvent.CONNECT, node)
      node.emit(Util.DeviceEvent.CONNECT, this)
    }
  }

  /**
    * @function
    * Disconnects the given node from this one if connected
    * @param {DeviceNode} node The node to disconnect
    */
  disconnect (node) {
    const i = this._connections.indexOf(node)
    if (i > -1) {
      this._connections.splice(i, 1)
      node.disconnect(this)

      this.emit(Util.DeviceEvent.DISCONNECT, node)
    }
  }
}
exports.DeviceNode = DeviceNode
