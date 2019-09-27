import AbstractAddress from '.'

/**
 * A hardware address (also known as a MAC address or physical address) uniquely identifies a given device including
 * its manufacturer (OUI) and the NIC-specific identifier.
 */
export default class HardwareAddress extends AbstractAddress {

    public static readonly RADIX = 16
    public static readonly BYTES = 6
    public static readonly SEP = ':'

    public static readonly BIT_MULTICAST = 1
    public static readonly BIT_LOCAL = 0b10

    /**
     * Gets a new hardware address from the given bytes
     * @param bytes The bytes to use
     */
    public static fromBytes (...bytes: number[]) {
        return AbstractAddress.createFromBytes(this, bytes)
    }

    /**
     * Gets a new hardware address from the given string
     */
    public static fromString (data: string) {
        return AbstractAddress.createFromString(this, data, this.SEP, this.RADIX)
    }

    public constructor (bytes: number[] = []) {
        super(HardwareAddress.BYTES, bytes)
    }

    /**
     * Returns whether or not this address is a multicast address (i.e. multicast bit is `1`).
     */
    public isMulticast (): boolean {
        const byte = this.getByte(0)
        return (byte & HardwareAddress.BIT_MULTICAST) > 0
    }

    /**
     * Returns whether or not this address is a locally-administered address (i.e. local bit is `1`)
     */
    public isLocal (): boolean {
        const byte = this.getByte(0)
        return (byte & HardwareAddress.BIT_LOCAL) > 0
    }

    /**
     * Returns whether or not this address is a unicast address (i.e. multicast bit is `0`).
     */
    public isUnicast (): boolean {
        return !this.isMulticast()
    }

    /**
     * Returns whether or not this address is a globally-administered address (i.e. local bit is `0`)
     */
    public isGlobal (): boolean {
        return !this.isLocal()
    }

    /** @inheritdoc */
    public toStringArray (radix: number = HardwareAddress.RADIX) {
        return super.toStringArray(radix)
    }

    /** @inheritdoc */
    public toString (radix: number = HardwareAddress.RADIX, separator: string = HardwareAddress.SEP) {
        return super.toString(radix, separator)
    }
}
