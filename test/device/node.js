'use strict'

const expect = require('expect.js')

const { EVENT, NodeType, DeviceNode } = require('../../src/device/node')

describe('device/node', () => {
  // device/node

  describe('NodeType', () => {
    // device/node.NodeType

    it('should have 4 values', () => {
      const vals = NodeType.enumValues

      expect(vals.length).to.be(4)
      // no sense testing that enumify works, it has its own tests
    })

    describe('ANY', () => {
      // device/node.NodeType.ANY

      it('should not have a type', () => {
        expect(NodeType.ANY.type).to.be(undefined)
      })

      it('should not have a default', () => {
        expect(NodeType.ANY.default).to.be(undefined)
      })
    })

    describe('BOOLEAN', () => {
      // device/node.NodeType.BOOLEAN

      it('should have a bool type', () => {
        expect(NodeType.BOOLEAN.type).to.be('boolean')
      })

      it('should default to "false"', () => {
        expect(NodeType.BOOLEAN.default).to.be(false)
      })
    })

    describe('NUMBER', () => {
      // device/node.NodeType.NUMBER

      it('should have a number type', () => {
        expect(NodeType.NUMBER.type).to.be('number')
      })

      it('should default to 0', () => {
        expect(NodeType.NUMBER.default).to.be(0)
      })
    })

    describe('STRING', () => {
      // device/node.NodeType.STRING

      it('should have a string type', () => {
        expect(NodeType.STRING.type).to.be('string')
      })

      it('should default to an empty string', () => {
        expect(NodeType.STRING.default).to.be('')
      })
    })
  })

  describe('DeviceNode', () => {
    // device/node.DeviceNode

    describe('<init>', () => {
      // device/node.DeviceNode#<init>

      const type = NodeType.BOOLEAN
      const conn = 2

      const dn = new DeviceNode(type, conn)

      it('should define type and connections as constants', () => {
        expect(dn.type).to.be(type)
        expect(dn.maxConnections).to.be(conn)
      })

      it('should create private "enabled" and "state" variables', () => {
        expect(dn._enabled).to.be(true)
        expect(dn._state).to.be(type.default)
      })
    })

    describe('#isValid', () => {
      // device/node.DeviceNode#isValid

      it('should be valid if type matches', () => {
        const dn = new DeviceNode(NodeType.BOOLEAN)
        expect(dn.isValid(true)).to.be(true)
      })

      it('should be valid if type is ANY', () => {
        const dn = new DeviceNode(NodeType.ANY)
        expect(dn.isValid('foo')).to.be(true)
        expect(dn.isValid(true)).to.be(true)
      })

      it('should be invalid if type does not match', () => {
        const dn = new DeviceNode(NodeType.BOOLEAN)
        expect(dn.isValid('foo')).to.be(false)
      })
    })

    describe('enabled', () => {
      // device/node.DeviceNode.enabled

      const dn = new DeviceNode(NodeType.BOOLEAN)

      it('should be the value of the private variable', () => {
        expect(dn.enabled).to.be(dn._enabled)
      })

      it('should set the value of the private variable', () => {
        dn.enabled = false
        expect(dn._enabled).to.be(false)
      })
    })

    describe('state', () => {
      // device/node.DeviceNode.state

      const dn = new DeviceNode(NodeType.BOOLEAN)

      it('should be the value of the private variable', () => {
        expect(dn.state).to.be(dn._state)
      })
    })

    describe('(data event)', () => {
      // device/node.DeviceNode (data event)

      const dn = new DeviceNode(NodeType.BOOLEAN)
      dn._state = false

      it('should set the state if valid', done => {
        dn.emit(EVENT, true)
        setTimeout(() => {
          expect(dn.state).to.be(true)
          done()
        })
      })

      it('should do nothing if not valid', done => {
        dn.emit(EVENT, 'foo')
        setTimeout(() => {
          // already true from previous test
          expect(dn.state).to.be(true)
          done()
        })
      })
    })
  })
})