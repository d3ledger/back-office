import gt from 'lodash/fp/gt'
import lte from 'lodash/fp/lte'

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
    { pattern: /^([a-z0-9\-.]*)\.(([a-z]{2,4})|([0-9]{1,3}\.([0-9]{1,3})\.([0-9]{1,3})))|(:[0-9]{1,5})$/, message: 'Invalid IP', trigger: 'change' }
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

function checkBalance (max) {
  return function validator (rule, value, callback, source, options) {
    const errors = []
    if (isNaN(Number(value))) errors.push('Invalid amount')
    else if (value !== null && value.length === 0) errors.push('Please input amount')
    else if (gt(value)(max)) errors.push('Current amount is bigger than your available balance')
    else if (lte(value)(0)) errors.push('Current amount is smaller or equal to 0')
    callback(errors)
  }
}

function generateRules (form) {
  let rules = {}
  Object.keys(form).forEach(key => {
    const validationRule = form[key]
    if (validationRule.pattern === 'tokensAmount') {
      const tokensAmountRule = Object.assign([], set[validationRule.pattern])
      tokensAmountRule.push({ validator: checkBalance(validationRule.amount) })
      rules[key] = tokensAmountRule
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
