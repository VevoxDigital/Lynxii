import { DataType } from '../datatype'

export class DataTypeNumber extends DataType<number> {

  public static readonly instance: DataTypeNumber

  private constructor () {
    super('number')
  }

  public serialize (val: number): Buffer {
    const data = Buffer.alloc(8)
    data.writeDoubleBE(val, 0)
    return data
  }

  public deserialize (data: Buffer): number {
    return data.readDoubleBE(0)
  }

}
