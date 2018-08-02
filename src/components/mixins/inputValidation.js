const set = {
  name: [
    { required: true, message: 'Please input username', trigger: 'change' },
    { pattern: /^[a-z_0-9]{1,32}$/, message: 'Username should match [a-Z_0-9]{1,32}', trigger: 'change' }
  ],
  nameDomain: [
    { required: true, message: 'Please input username', trigger: 'change' },
    { pattern: /^[a-z_0-9]{1,32}@[a-z_0-9]{1,9}$/, message: 'Username should match [a-Z_0-9]{1,32}@[a-Z_0-9]{1,9}', trigger: 'change' }
  ],
  privateKey: [
    { required: true, message: 'Please input private key', trigger: 'change' },
    { pattern: /^[A-Za-z0-9]{64}$/, message: 'Private key should match [A-Za-z0-9]{64}', trigger: 'change' }
  ],
  nodeIp: [
    { required: true, message: 'Please input node ip', trigger: 'change' },
    { pattern: /(^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(:[0-9]{1,5})?$|^[^0-9])/, message: 'Invalid IP', trigger: 'change' }
  ],
  walletAddress: [
    { required: true, message: 'Please input wallet address', trigger: 'change' },
    { pattern: /^0x[a-fA-F0-9]{40}$/, message: 'Invalid wallet address', trigger: 'change' }
  ],
  tokensAmount: [
    { required: true, message: 'Please input amount', trigger: 'change' },
    { pattern: /^(?![0.]+$)\d+(\.\d+)?$/, message: 'Invalid amount', trigger: 'change' }
  ]
}

function generateRules (form) {
  let rules = {}
  Object.keys(form).forEach(key => {
    const validationKey = form[key]
    rules[key] = set[validationKey]
  })
  return rules
}

const inputValidation = (form) => {
  return {
    data () {
      return {
        rules: generateRules(form)
      }
    }
  }
}

export default inputValidation
