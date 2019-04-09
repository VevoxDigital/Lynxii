
declare module NodeJS {
  interface WriteStream {
    /** Whether or not output should be in JSON */
    json?: boolean

    /** Writes out a line, stringified to JSON if it should be */
    writeln: (this: WriteStream, message: JSON.Value, cb?: Functional.Consumer<[Maybe<Error>]>) => void
  }
}
