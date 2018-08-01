/**
 * Capitalizes string
 * @param {String} string
 * @returns {String} capitalized string
 */
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

/**
 * Transfroms hex string to Uint8Array of bytes
 * @param {String} string string in hex
 * @returns {Uint8Array}
 */
const hexStrToByte = string => {
  if (!string) {
    return new Uint8Array()
  }

  var a = []
  for (var i = 0, len = string.length; i < len; i += 2) {
    a.push(parseInt(string.substr(i, 2), 16))
  }

  return new Uint8Array(a)
}

export {
  capitalize,
  hexStrToByte
}
