'use strict'

const expect = require('expect.js')

let command

// define 'command'
beforeEach(() => {
  const $command = '../src/command'
  const $util = '../src/lib/util'

  delete require.cache[require.resolve($command)]
  delete require.cache[require.resolve($util)]

  command = require($command)
  global.Util = require($util)
})

describe('command', () => {
  // command

  describe('exec', () => {
    // command.exec

    it('should split args and call given command', done => {
      command.$commands.set('foo', new command.Command('foo', (...args) => {
        expect(args[0]).to.be('bar')
        expect(args[1]).to.be('baz')

        done()
      }))

      command.exec('foo bar baz')
    })

    it('should reject a promise if command is not found', done => {
      command.exec('foo bar baz').catch(err => {
        expect(err).to.not.be.ok()
        done()
      }).done()
    })
  })

  describe('Command', () => {
    // command.Command

    describe('<init>', () => {
      // command.Command#<init>

      it('should define name and callback', () => {
        const name = 'foo'
        const cb = () => { }
        const cmd = new command.Command(name, cb)

        expect(cmd.name).to.be(name)
        expect(cmd.$exec).to.be(cb)
      })
    })

    describe('#exec', () => {
      // command.Command#exec

      it('should call (and promisify) the command callback', done => {
        const name = 'foo'
        const cb = arg1 => {
          return arg1
        }

        const cmd = new command.Command(name, cb)
        const args = [ 'arg1' ]
        cmd.exec(args).then(res => {
          expect(res).to.be(args[0])
          done()
        }).catch(err => expect().fail(err)).done()
      })
    })
  })

  describe('CommandAlias', () => {
    // command.CommandAlias

    it('should call execution with aliased command', done => {
      command.exec = str => {
        expect(str).to.be('bar baz\n')
        done()
      }

      const cmd = new command.CommandAlias('foo', 'bar')
      cmd.exec([ 'baz' ]).catch(err => expect().fail(err)).done()
    })
  })

  describe('commands', () => {
    // command.command.exit

    describe('exit', () => {
      // command.commands.exit

      it('should close the prompt', done => {
        command.exec('exit')
        Util.prompt = { close: done }
        command.exec('exit')
      })
    })
  })
})
