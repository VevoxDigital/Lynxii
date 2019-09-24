import { ISerializeable, OutOfBoundsException } from 'vx-util'

/**
 * An address represents a series of bytes which can uniquely refer to an object. While unique, however,
 * there is no garuntee address are not re-used once the previous objects have been released.
 */
export default abstract class AbstractAddress implements Iterable<number>, ISerializeable<number[]> {

    /** The maximum numerical size of a byte */
    public static readonly BYTE = 0xFF

    public static createFromBytes <T extends AbstractAddress> (c: Instanciable<T, [number[]]>, bytes: number[]): T {
        return new c(bytes)
    }

    public static createFromString <T extends AbstractAddress> (c: Instanciable<T, [number[]]>,
                                                                str: string,
                                                                byteCount: number,
                                                                separator: string,
                                                                radix: number): T {
            str = str.trim()
            const potentialBytes = str.split(new RegExp('/' + separator + '/', 'g'))
            const bytes: number[] = []
            for (let i = 0; i < byteCount; i++) {
                if (i >= potentialBytes.length) {
                    bytes[i] = 0
                } else {
                    const num = Number.parseInt(potentialBytes[i], radix)
                    bytes[i] = Number.isNaN(num) ? 0 : num
                }
            }
            return new c(bytes)
        }

    private bytes: number[] = []

    public constructor (byteCount: number, bytes: number[]) {
        this.bytes.length = byteCount
        for (let i = 0; i < this.length; i++) {
            this.bytes[i] = this.coerceByte(bytes[i])
        }
    }

    public [Symbol.iterator] () {
        return this.bytes[Symbol.iterator]()
    }

    /** The length of this address in bytes */
    public get length (): number {
        return this.bytes.length
    }

    /**
     * Gets the byte at a given index
     * @param index The index of the byte
     */
    public getByte (index: number): number {
        index = this.coerceIndex(index)
        return this.bytes[index]
    }

    /**
     * Gets an array of bytes in this address.
     */
    public getBytes (): number[] {
        return this.bytes.slice()
    }

    /**
     * Converts this address to a string array of its corresponding bytes
     * @param radix The radix to use; defaults to `10`
     */
    public toStringArray (radix: number = 10) {
        return this.bytes.map(byte => byte.toString(radix))
    }

    /**
     * Converts this address to a string by joining its corresponding string array
     * with the given separator
     * @param radix The radix to use; defaults to `10`
     * @param separator The separator to use; defaults to an empty string
     */
    public toString (radix: number = 10, separator: string = '') {
        return this.toStringArray(radix).join(separator)
    }

    /**
     * Determines if this address equals a given address
     */
    public equals (other: AbstractAddress): boolean {
        if (this.length !== other.length) return false

        for (let i = 0; i < this.length; i++) {
            if (this.getByte(i) !== other.getByte(i)) {
                return false
            }
        }
        return true
    }

    public serialize (): number[] {
        return this.getBytes()
    }

    public toJSON (): number[] {
        return this.serialize()
    }

    private coerceByte (byte: number): number {
        return Math.min(Math.abs(byte), AbstractAddress.BYTE)
    }

    private coerceIndex (index: number): number {
        if (index < 0) {
            index += this.length
        }
        if (index < 0 || index >= this.length) {
            throw new OutOfBoundsException(index, this.length)
        }
        return index
    }

}
