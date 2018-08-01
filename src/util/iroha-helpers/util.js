const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const hexStringToByte = string => {
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
  hexStringToByte
}
