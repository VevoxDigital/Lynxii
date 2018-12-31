
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { EventEmitter } from 'events'
import LynxiiServer from 'lynxii-server/core/server'
import 'mocha'
import { LoggingLevel } from 'vx-util'

chai.use(chaiAsPromised)
const { expect } = chai

const TEST_MESSAGE = 'Hello world!'

describe('server/core', () => {
  describe('LynxiiServer', () => {
    //
    let lynxii: LynxiiServer
    before(() => {
      lynxii = new LynxiiServer()
    })
    //
    describe('<init>()', () => {
      it('should create a Lynxii instance with defaults', () => {
        expect(lynxii).to.have.property('events').that.is.an.instanceOf(EventEmitter)
      })
    })
    //
    describe('message(string)', () => {
      it('should emit a message event at INFO level', done => {
        lynxii.events.once('message', (level, msg) => {
          expect(level).to.equal(LoggingLevel.INFO)
          expect(msg).to.equal(TEST_MESSAGE)
          done()
        })
        lynxii.message(TEST_MESSAGE)
      })
    })
    //
    describe('message(LoggingLevel, string)', () => {
      it('should emit a message event at the specified level', done => {
        lynxii.events.once('message', (level, msg) => {
          expect(level).to.equal(LoggingLevel.SILLY)
          expect(msg).to.equal(TEST_MESSAGE)
          done()
        })
        lynxii.message(LoggingLevel.SILLY, TEST_MESSAGE)
      })
    })
    //
  })
})
