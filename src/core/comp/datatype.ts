
export abstract class DataType<T> {

  public readonly name: string

  public constructor (name: string) {
    this.name = name
  }

  /**
   * Parses the given binary data into a type value
   * @param data The data buffer
   */
  public abstract deserialize (data: Buffer): T

  /**
   * Serializes a given value into a buffer
   * @param val The value to serialize
   */
  public abstract serialize (val: T): Buffer

}
