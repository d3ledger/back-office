import gt from 'lodash/fp/gt'
import lte from 'lodash/fp/lte'
import { derivePublicKey } from 'ed25519.js'

const privateKey = {
  pattern: /^[A-Za-z0-9]{64}$/,
  message: 'Private key should match [A-Za-z0-9]{64}'
}

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
    { pattern: privateKey.pattern, message: privateKey.message, trigger: 'change' }
  ],
  nodeIp: [
    { required: true, message: 'Please input node ip', trigger: 'change' },
    { pattern: /^([a-z0-9\-.]*)\.(([a-z]{2,4})|([0-9]{1,3}\.([0-9]{1,3})\.([0-9]{1,3})))|(:[0-9]{1,5})$/, message: 'Invalid IP', trigger: 'change' }
  ],
  walletAddress: [
    { required: true, message: 'Please input wallet address', trigger: 'change' }
  ],
  tokensAmount: [
    { required: true, message: 'Please input amount', trigger: 'change' },
    { pattern: /^(?![0.]+$)\d+(\.\d+)?$/, message: 'Invalid amount', trigger: 'change' }
  ]
}

set['privateKeyRequired'] = [
  { required: true, message: 'Please input private key', trigger: 'change' },
  ...set['privateKey']
]

const getPrecision = (v) => (v.split('.')[1] || []).length

const checkFirstZero = (v) => {
  if (!v.length) return true

  if (v[0] !== '0') return true
  else {
    return v[0] === '0' && v[1] === '.'
  }
}

function checkBalance (maxValue, maxPrecision, asset) {
  return function validator (rule, value, callback, source, options) {
    const errors = []
    if (!asset) errors.push('Please select asset')
    else if (isNaN(Number(value))) errors.push('Invalid amount')
    else if (!checkFirstZero(value)) errors.push('Please remove zeros')
    else if (value !== null && gt(getPrecision(value))(maxPrecision)) errors.push(`Too big precision, maximum precision is ${maxPrecision}`)
    else if (value !== null && value.length === 0) errors.push('Please input amount')
    else if (gt(Number(value))(Number(maxValue))) errors.push('Current amount is bigger than your available balance')
    else if (lte(Number(value))(0)) errors.push('Current amount is smaller or equal to 0')
    callback(errors)
  }
}

function checkWallet (wallets) {
  return function validator (rule, value, callback, source, options) {
    const errors = []
    const validateBTC = /^[123][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(value)
    const validateETH = /^0x[a-fA-F0-9]{40}$/.test(value)
    if (!validateBTC && !validateETH) errors.push('Invalid wallet address')
    else if (wallets && wallets.includes(value)) errors.push('This wallet is already in the whitelist')
    callback(errors)
  }
}

function checkRepeatingPrivateKey (keys) {
  return function validator (rule, value, callback, source, options) {
    const errors = []
    if (!!value && !privateKey.pattern.test(value)) errors.push(privateKey.message)
    else if (keys.includes(derivePublicKey(Buffer.from(value, 'hex')).toString('hex'))) errors.push('Transaction is already signed with this key')
    callback(errors)
  }
}

function generateRules (form) {
  let rules = {}
  Object.keys(form).forEach(key => {
    const validationRule = form[key]
    if (validationRule.pattern === 'tokensAmount') {
      const tokensAmountRule = Object.assign([], set[validationRule.pattern])
      tokensAmountRule.push({
        validator: checkBalance(validationRule.amount, validationRule.precision, validationRule.asset)
      })
      rules[key] = tokensAmountRule
    } else if (validationRule.pattern === 'walletAddress') {
      const walletAddressRule = Object.assign([], set[validationRule])
      walletAddressRule.push({ validator: checkWallet(validationRule.wallets) })
      rules[key] = walletAddressRule
    } else if (validationRule.pattern === 'repeatingPrivateKey') {
      const privateKeyRule = [{ validator: checkRepeatingPrivateKey(validationRule.keys) }]
      rules[key] = privateKeyRule
    } else {
      rules[key] = set[validationRule]
    }
  })
  return rules
}

const inputValidation = (form) => {
  return {
    data () {
      return {
        rules: generateRules(form)
      }
    },
    methods: {
      _refreshRules (form) {
        const newRules = generateRules(form)
        this.rules = Object.assign(this.rules, newRules)
      }
    }
  }
}

export default inputValidation
