import AbstractAddress from '../../net/address'
import HardwareAddress from '../../net/address/hardware'

/**
 * An address representing a component in the
 */
export class ComponentAddress extends AbstractAddress {
    public static readonly BYTES_INDEX = 2
    public static readonly BYTES = HardwareAddress.BYTES + ComponentAddress.BYTES_INDEX

    /**
     * Creates a new address from the given bytes
     * @param bytes The bytes to create from
     */
    public static fromBytes (...bytes: number[]) {
        return AbstractAddress.createFromBytes(this, bytes)
    }

    /**
     * Creates a new address from the given string
     * @param data The string to create from
     */
    public static fromString (data: string) {
        return AbstractAddress.createFromString(this, data, HardwareAddress.SEP, HardwareAddress.RADIX)
    }

    /**
     * Creates a new address from the given hardware address and index
     * @param addr The hardware address
     * @param indexBytes The index bytes
     */
    public static fromHardwareAddress (addr: HardwareAddress, indexBytes: number[] = []) {
        return new this(addr.getBytes().concat(indexBytes))
    }

    private hwAddr: HardwareAddress

    public constructor (bytes: number[]) {
        super(ComponentAddress.BYTES, bytes)

        this.hwAddr = new HardwareAddress(bytes.slice(0, HardwareAddress.BYTES))
    }

    /**
     * Gets the hardware address at the start of this address
     */
    public getHardwareAddress () {
        return this.hwAddr
    }

    /**
     * Gets the bytes on the end of this address representing the index
     */
    public getIndexBytes (): number[] {
        return this.getBytes().slice(HardwareAddress.BYTES)
    }

}
