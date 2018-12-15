
/**
 * Exports a number to a string, optionally with padding.
 * @param num The number to export
 * @param radix The radix of the target string value
 * @param pad Number of characters to pad with zeros to.
 */
export function numberToString (num: number, radix: number = 10, pad: number = 0) {
  let str = num.toString(radix)

  if (pad > 0) {
    const rep = '0'.repeat(pad)
    str = (rep + str).slice(-pad)
  }

  return str
}
