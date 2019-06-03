import { DataType } from '../datatype'

export class DataTypeBoolean extends DataType<boolean> {

  public static readonly instance = new DataTypeBoolean()

  private constructor () {
    super('boolean')
  }

  public serialize (val: boolean): Buffer {
    return Buffer.of(val ? 1 : 0)
  }

  public deserialize (data: Buffer): boolean {
    return data[0] > 0
  }
}
