import { expect } from 'chai'
import AccountInjector from 'inject-loader!../../../src/store/Account.js'

const DUMMY_NODE_IP = 'DUMMY_NODE_IP'
const irohaUtil = require('../../../src/util/iroha-util')
const irohaUtilMock = Object.assign(irohaUtil, {
  getStoredNodeIp: () => DUMMY_NODE_IP
})

describe('Account store', () => {
  describe('mutations', () => {
    let types, mutations

    function testErrorHandling (type) {
      const codes = ['UNAVAILABLE', 'CANCELLED']
      codes.forEach(codeName => {
        it(`${type} should treat grpc ${codeName} as a connection error`, () => {
          const grpc = require('grpc')
          const state = {}
          const error = { code: grpc.status[codeName] }

          expect(state.connectionError).to.be.undefined

          mutations[types[type]](state, error)

          expect(state.connectionError).to.equal(error)
        })
      })
    }

    beforeEach(() => {
      const Account = AccountInjector({
        'util/iroha-util': irohaUtilMock,
        'util/iroha-amount': require('../../../src/util/iroha-amount')
      }).default

      types = Account.types
      mutations = Account.mutations
    })

    it('RESET should reset the state', () => {
      const state = {
        accountId: 'a',
        nodeIp: 'a',
        accountInfo: { a: 1 },
        rawAssetTransactions: { a: 1 },
        assets: [1],
        connectionError: 1
      }
      const expectedState = {
        accountId: '',
        nodeIp: DUMMY_NODE_IP,
        accountInfo: {},
        rawAssetTransactions: {},
        assets: [],
        connectionError: null
      }

      mutations[types.RESET](state)

      expect(state).to.deep.equal(expectedState)
    })

    it('LOGIN_SUCCESS should set an accountId', () => {
      const state = {}
      const account = { accountId: 'a@b' }

      mutations[types.LOGIN_SUCCESS](state, account)

      expect(state.accountId).to.equal(account.accountId)
    })

    testErrorHandling('LOGIN_FAILURE')

    it('GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS should set transactions', () => {
      const state = { rawAssetTransactions: {} }
      const assetId = 'a#b'
      const transactions = [Math.random()]

      mutations[types.GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS](state, { assetId, transactions })

      expect(state.rawAssetTransactions)
        .to.have.property(assetId)
        .that.deep.equal(transactions)
    })

    testErrorHandling('GET_ACCOUNT_ASSET_TRANSACTIONS_FAILURE')

    it('GET_ACCOUNT_ASSETS_SUCCESS should set assets', () => {
      const state = {}
      const assets = [Math.random()]

      mutations[types.GET_ACCOUNT_ASSETS_SUCCESS](state, assets)

      expect(state.assets).to.deep.equal(assets)
    })

    testErrorHandling('GET_ACCOUNT_ASSETS_FAILURE')

    testErrorHandling('TRANSFER_ASSET_FAILURE')
  })

  describe('actions', () => {
    let actions

    beforeEach(() => {
      const Account = AccountInjector({
        'util/iroha-util': irohaUtilMock,
        'util/iroha-amount': require('../../../src/util/iroha-amount')
      }).default

      actions = Account.actions
    })

    // TODO: write tests
    it('', () => {
      actions
    })
  })

  describe('getters', () => {
    let getters

    beforeEach(() => {
      const Account = AccountInjector({
        'util/iroha-util': irohaUtilMock,
        'util/iroha-amount': require('../../../src/util/iroha-amount')
      }).default

      getters = Account.getters
    })

    // TODO: write tests
    it('', () => {
      getters
    })
  })
})
