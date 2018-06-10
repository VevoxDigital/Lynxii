/** Gets the keys from the given enum */
export function getEnumKeys (enumValues): Array<string> {
  const keys = Object.keys(enumValues)
  return keys.slice(keys.length / 2)
}

/** A void-returning function that does nothing */
export function noop () { }
