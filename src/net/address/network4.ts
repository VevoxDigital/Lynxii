import AbstractAddress from '.'

/**
 * An address representing an IPv4 address
 */
export default class NetworkV4Address extends AbstractAddress {

    public static readonly BYTES = 4
    public static readonly RADIX = 10
    public static readonly SEP = '.'

    /** The broadcast address: `255.255.255.255` */
    public static readonly BROADCAST = NetworkV4Address.fromBytes(255, 255, 255, 255)

    /** The "any particular address" address: `0.0.0.0` */
    public static readonly ANY = NetworkV4Address.fromBytes()

    /** The default "localhost" or "loopback" address: `127.0.0.1` */
    public static readonly LOCALHOST = NetworkV4Address.fromBytes(127, 0, 0, 1)

    /** The subnet mask for a Class-A (`/8`) network: `255.0.0.0` */
    public static readonly SUBNET_MASK_A = NetworkV4Address.fromBytes(255)

    /** The subnet mask for a Class-B (`/16`) network: `255.255.0.0` */
    public static readonly SUBNET_MASK_B = NetworkV4Address.fromBytes(255, 255)

    /** The subnet mask for a Class-C (`/24`) network: `255.255.255.0` */
    public static readonly SUBNET_MASK_C = NetworkV4Address.fromBytes(255, 255, 255)

    /**
     * Gets a new network v4 address from the given bytes
     * @param bytes The bytes
     */
    public static fromBytes (...bytes: number[]) {
        return AbstractAddress.createFromBytes(this, bytes)
    }

    /**
     * Gets a new network address from the given string
     * @param str The string
     */
    public static fromString (str: string) {
        return AbstractAddress.createFromString(this, str, this.BYTES, this.SEP, this.RADIX)
    }

    public constructor (bytes: number[] = []) {
        super(NetworkV4Address.BYTES, bytes)
    }

    /**
     * Masks this given address to the CDR ("slash notation") mask, returning a new address
     * @param mask The mask
     */
    public slash (mask: number): NetworkV4Address {
        mask = Math.min(Math.abs(Math.floor(mask)), NetworkV4Address.BYTES * 8)

        const maskUntouched = Math.floor(mask / 8)
        const maskBits = mask % 8

        const bytes = this.getBytes()
        for (let i = 0; i < this.length; i++) {
            if (i >= maskUntouched) {
                bytes[i] = i === maskUntouched && maskBits > 0
                    ? bytes[i] & maskBits
                    : 0
            }
        }

        return new NetworkV4Address(bytes)
    }

    /**
     * Masks this address with the given address mask
     * @param mask The mask to apply
     */
    public mask (mask: NetworkV4Address): NetworkV4Address {
        const bytes = this.getBytes()
        for (let i = 0; i < this.length; i++) {
            bytes[i] = bytes[i] & mask.getByte(i)
        }

        return new NetworkV4Address(bytes)
    }

    /** @inheritdoc */
    public toString (radix: number = NetworkV4Address.RADIX, separator: string = NetworkV4Address.SEP) {
        return super.toString(radix, separator)
    }

}
