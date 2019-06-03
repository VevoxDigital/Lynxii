import { DataType } from '../datatype'

export class DataTypeString<E extends string> extends DataType<string> {

  public static readonly utf8 = new DataTypeString('utf8')
  public static readonly ascii = new DataTypeString('ascii')

  public readonly encoding: E

  private constructor (encoding: E) {
    super('string')
    this.encoding = encoding
  }

  public serialize (val: string): Buffer {
    return Buffer.from(val, this.encoding)
  }

  public deserialize (data: Buffer): string {
    return data.toString(this.encoding)
  }

}
