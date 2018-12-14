
// these are pretty much in the order they were added
// nothing special here
const errorList = {
  DEVICE_ID_INVALID_FORMAT: 'Given ID does not match device ID format (did you forget to remove octet separators?)',
  DEVICE_INSTANCE_ID_TOO_LARGE: 'Device instance is greater than 0xFFFF (65535)',
  DEVICE_INSTANCE_ID_NEGATIVE: 'Device instance IDs must be positive',
  DEVICE_ADDRESS_INCORRECT_UL: 'Device has incorrect U/L bit, logical devices should be 1 and physicals 0',
  DEVICE_ADDRESS_IS_UNICAST: 'Device address is unicast (devices must be multicast!)'
}

// assign error codes
// this weird "eList" thing is for TS's sake. I am aware it is hacky and weird
const eList: IDictionary<string> = errorList
let errorCode = 1000
for (const error in Object.keys(eList)) eList[error] = `[${errorCode++} ${error}] ${eList[error]}`

/** The list of errors Lynxii may fire */
export default errorList
