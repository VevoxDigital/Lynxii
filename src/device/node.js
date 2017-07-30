'use strict'

const assert = require('assert')

const { EventEmitter } = require('events')

// oh how I wish we could use ES6 modules
const { Enum } = require('enumify')

Object.defineProperty(exports, 'EVENT', { value: '_data', enumerable: true })

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
    Object.defineProperty(this, 'maxConnections', { value: connections, enumerable: true })

    // private variables
    Object.defineProperty(this, '_enabled', { value: true, enumerable: false, writable: true })
    Object.defineProperty(this, '_state', { value: type.default, enumerable: false, writable: true })

    this.on(exports.EVENT, data => {
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
}
exports.DeviceNode = DeviceNode
