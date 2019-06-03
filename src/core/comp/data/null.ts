import { DataType } from '../datatype'

export class DataTypeNull extends DataType<null> {

  public static readonly instance = new DataTypeNull()

  private constructor () {
    super('null')
  }

  public serialize () {
    return Buffer.alloc(0)
  }

  public deserialize () {
    return null
  }

}
