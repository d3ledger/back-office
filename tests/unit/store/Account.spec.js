import chai from 'chai'
import sinon from 'sinon'
import AccountInjector from 'inject-loader!../../../src/store/Account.js'
import helper from '../helper'

const {
  randomHex,
  randomAccountId,
  randomAssetId,
  randomNodeIp,
  randomPublicKey,
  randomPrivateKey,
  randomObject,
  randomAmount,
  randomAmountRng
} = helper
const expect = chai.expect

chai.use(require('chai-things'))

describe('Account store', () => {
  /*
   * Mock irohaUtil so that unit tests can work without irohad
   */
  const MOCK_ASSETS = require('../fixtures/assets.json')
  const MOCK_ASSET_TRANSACTIONS = require('../fixtures/transactions.json')
  const MOCK_TRANSACTIONS = MOCK_ASSET_TRANSACTIONS['omisego#test']
  const MOCK_NODE_IP = 'MOCK_NODE_IP'
  const MOCK_NOTARY_IP = 'MOCK_NOTARY_IP'
  const MOCK_ACCOUNT_RESPONSE = { accountId: randomAccountId() }
  const MOCK_KEYPAIR = {
    publicKey: randomPublicKey(),
    privateKey: randomPrivateKey()
  }
  const irohaUtil = require('@util/iroha').default
  const irohaUtilMock = Object.assign(irohaUtil, {
    getStoredNodeIp: () => MOCK_NODE_IP,
    signup: (username) => Promise.resolve({ username, ...MOCK_KEYPAIR }),
    login: (username, privateKey, nodeIp) => Promise.resolve(MOCK_ACCOUNT_RESPONSE),
    logout: () => Promise.resolve(),
    generateKeypair: () => MOCK_KEYPAIR,
    getAccountAssetTransactions: () => Promise.resolve(MOCK_TRANSACTIONS),
    getAccountAssets: (accountId) => Promise.resolve(MOCK_ASSETS),
    getAccountTransactions: () => Promise.resolve(MOCK_TRANSACTIONS),
    transferAsset: () => Promise.resolve()
  })

  const notaryUtilMock = {
    _forceFail: false,
    _MOCK_ERROR: new Error(),
    baseURL: MOCK_NOTARY_IP,
    signup: () => {
      if (notaryUtilMock._forceFail) return new Promise(() => { throw notaryUtilMock._MOCK_ERROR })
      else return Promise.resolve()
    }
  }

  let types, mutations, actions, getters

  beforeEach(() => {
    ({ types, mutations, actions, getters } = AccountInjector({
      '@util/iroha': irohaUtilMock,
      '@util/store-util': require('@util/store-util'),
      '@util/notary-util': notaryUtilMock
    }).default)

    notaryUtilMock._forceFail = false
  })

  describe('Mutations', () => {
    function testErrorHandling (type) {
      const codes = ['Unavailable', 'Canceled']

      codes.forEach(codeName => {
        it(`${type} should treat grpc ${codeName} as a connection error`, () => {
          const grpc = require('grpc-web-client').grpc
          const state = {}
          const error = { code: grpc.Code[codeName] }

          expect(state.connectionError).to.not.exist

          mutations[types[type]](state, error)

          expect(state.connectionError).to.equal(error)
        })
      })

      it(`${type} should not treat other errors as a connection error`, () => {
        const state = {}
        const error = new Error()

        expect(state.connectionError).to.not.exist

        mutations[types[type]](state, error)

        expect(state.connectionError).to.not.exist
      })
    }

    it('RESET should reset the state', () => {
      const state = {
        accountId: randomAccountId(),
        nodeIp: randomNodeIp(),
        notaryIp: randomNodeIp(),
        accountInfo: randomObject(),
        accountQuorum: randomAmountRng(),
        accountSignatories: [randomObject()],
        rawAssetTransactions: randomObject(),
        rawUnsignedTransactions: [randomObject()],
        rawTransactions: [randomObject()],
        rawPendingTransactions: [randomObject()],
        assets: randomObject(),
        connectionError: new Error()
      }

      const expectedState = {
        accountId: '',
        nodeIp: MOCK_NODE_IP,
        notaryIp: MOCK_NOTARY_IP,
        accountInfo: {},
        accountQuorum: 0,
        accountSignatories: [],
        rawAssetTransactions: {},
        rawUnsignedTransactions: [],
        rawTransactions: [],
        rawPendingTransactions: null,
        assets: [],
        connectionError: null
      }

      mutations[types.RESET](state)

      expect(state).to.be.deep.equal(expectedState)
    })

    it('SIGNUP_SUCCESS should not change the state', () => {
      const state = {}
      const params = {
        username: randomAccountId().split('@')[1],
        publicKey: randomPublicKey(),
        privateKey: randomPrivateKey()
      }
      const expectedState = {}

      mutations[types.SIGNUP_SUCCESS](state, params)

      expect(state).to.be.deep.equal(expectedState)
    })

    testErrorHandling('SIGNUP_FAILURE')

    it('LOGIN_SUCCESS should set an accountId to state', () => {
      const state = {}
      const account = { accountId: randomAccountId(), jsonData: '{"registration_service_red@notary": {"ethereum_wallet": "0x5f3dba5e45909d1bf126aa0af0601b1a369dbfd7"}}' }

      mutations[types.LOGIN_SUCCESS](state, account)

      expect(state.accountId).to.be.equal(account.accountId)
    })

    it('LOGIN_SUCCESS should set an accountInfo to state', () => {
      const state = {}
      const account = { accountId: randomAccountId(), jsonData: '{"registration_service_red@notary": {"ethereum_wallet": "0x5f3dba5e45909d1bf126aa0af0601b1a369dbfd7"}}' }

      mutations[types.LOGIN_SUCCESS](state, account)

      expect(state.accountInfo).to.be.deep.equal(JSON.parse(account.jsonData))
    })

    testErrorHandling('LOGIN_FAILURE')
    testErrorHandling('LOGOUT_FAILURE')

    it('GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS should set transactions to state', () => {
      const state = { rawAssetTransactions: {} }
      const assetId = randomAssetId()
      const transactions = MOCK_TRANSACTIONS

      mutations[types.GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS](state, { assetId, transactions })

      expect(state.rawAssetTransactions)
        .to.have.property(assetId)
        .that.is.deep.equal(transactions)
    })

    testErrorHandling('GET_ACCOUNT_ASSET_TRANSACTIONS_FAILURE')

    it('GET_ACCOUNT_ASSETS_SUCCESS should set assets to state', () => {
      const state = {}
      const assets = MOCK_ASSETS

      mutations[types.GET_ACCOUNT_ASSETS_SUCCESS](state, assets)

      expect(state.assets).to.deep.equal(assets)
    })

    testErrorHandling('GET_ACCOUNT_ASSETS_FAILURE')

    it('GET_ACCOUNT_TRANSACTIONS_SUCCESS should set transactions to state', () => {
      const state = { rawTransactions: {} }
      const transactions = MOCK_TRANSACTIONS

      mutations[types.GET_ACCOUNT_TRANSACTIONS_SUCCESS](state, transactions)

      expect(state.rawTransactions).to.be.deep.equal(transactions)
    })

    testErrorHandling('GET_ACCOUNT_TRANSACTIONS_FAILURE')
    testErrorHandling('TRANSFER_ASSET_FAILURE')

    it.skip('CREATE_SETTLEMENT')
    it.skip('ACCEPT_SETTLEMENT')
    it.skip('REJECT_SETTLEMENT')
    it.skip('CANCEL_SETTLEMENT')
  })

  describe('Actions', () => {
    describe('signup', () => {
      it('should call mutations in correct order', done => {
        const commit = sinon.spy()
        const params = { username: randomAccountId().split('@')[1] }
        actions.signup({ commit }, params)
          .then(() => {
            expect(commit.args).to.be.deep.equal([
              [types.SIGNUP_REQUEST],
              [types.SIGNUP_SUCCESS, {
                username: params.username,
                ...MOCK_KEYPAIR
              }]
            ])
            done()
          })
          .catch(done)
      })

      it('should call SIGNUP_FAILURE if notary-util fails', done => {
        const commit = sinon.spy()
        const params = { username: randomAccountId().split('@')[1] }

        notaryUtilMock._forceFail = true
        actions.signup({ commit }, params)
          .then(() => done('it should fail'))
          .catch(() => {
            expect(commit.args).to.be.deep.equal([
              [types.SIGNUP_REQUEST],
              [types.SIGNUP_FAILURE, notaryUtilMock._MOCK_ERROR]
            ])
            done()
          })
      })
    })

    describe('login', () => {
      it('should call mutations in correct order', done => {
        const commit = sinon.spy()
        const params = {
          username: randomAccountId(),
          privateKey: randomPrivateKey(),
          nodeIp: randomNodeIp()
        }

        actions.login({ commit }, params)
          .then(() => {
            expect(commit.args).to.be.deep.equal([
              [types.LOGIN_REQUEST],
              [types.LOGIN_SUCCESS, MOCK_ACCOUNT_RESPONSE]
            ])
            done()
          })
          .catch(done)
      })
    })

    describe('logout', () => {
      it('should call mutations in correct order', done => {
        const commit = sinon.spy()

        actions.logout({ commit })
          .then(() => {
            expect(commit.args).to.deep.equal([
              [types.LOGOUT_REQUEST],
              [types.RESET],
              [types.LOGOUT_SUCCESS]
            ])
            done()
          })
          .catch(done)
      })
    })

    describe('getAccountAssetTransactions', () => {
      it('should call mutations in correct order', done => {
        const commit = sinon.spy()
        const state = { accountId: randomAccountId() }
        const params = { assetId: randomAssetId() }
        const expectedResponse = {
          assetId: params.assetId,
          transactions: MOCK_TRANSACTIONS
        }

        actions.getAccountAssetTransactions({ commit, state }, params)
          .then(() => {
            expect(commit.args).to.deep.equal([
              [types.GET_ACCOUNT_ASSET_TRANSACTIONS_REQUEST],
              [types.GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS, expectedResponse]
            ])
            done()
          })
          .catch(done)
      })
    })

    describe('getAccountAssets', () => {
      it('should call mutations in correct order', done => {
        const commit = sinon.spy()
        const state = { accountId: randomAccountId() }
        const expectedResponse = MOCK_ASSETS

        actions.getAccountAssets({ commit, state })
          .then(() => {
            expect(commit.args).to.deep.equal([
              [types.GET_ACCOUNT_ASSETS_REQUEST],
              [types.GET_ACCOUNT_ASSETS_SUCCESS, expectedResponse]
            ])
            done()
          })
          .catch(done)
      })
    })

    describe('getAccountTransactions', () => {
      it('should call mutations in correct order', done => {
        const commit = sinon.spy()
        const state = { accountId: randomAccountId() }
        const expectedResponse = MOCK_TRANSACTIONS

        actions.getAccountTransactions({ commit, state })
          .then(() => {
            expect(commit.args).to.deep.equal([
              [types.GET_ACCOUNT_TRANSACTIONS_REQUEST],
              [types.GET_ACCOUNT_TRANSACTIONS_SUCCESS, expectedResponse]
            ])
            done()
          })
          .catch(done)
      })
    })

    describe('getAllUnsignedTransactions', () => {
      it.skip('should call mutations in correct order')
    })

    describe('transferAsset', () => {
      it('should call mutations in correct order', done => {
        const commit = sinon.spy()
        const state = { accountId: randomAccountId() }
        const params = {
          assetId: randomAssetId(),
          to: randomAccountId(),
          description: randomHex(10),
          amount: randomAmount()
        }

        actions.transferAsset({ commit, state }, params)
          .then(() => {
            expect(commit.args).to.deep.equal([
              [types.TRANSFER_ASSET_REQUEST],
              [types.TRANSFER_ASSET_SUCCESS]
            ])
            done()
          })
          .catch(done)
      })
    })

    describe('createSettlement', () => {
      it.skip('should call mutations in correct order')
    })

    describe('acceptSettlement', () => {
      it.skip('should call mutations in correct order')
    })

    describe('rejectSettlement', () => {
      it.skip('should call mutations in correct order')
    })

    describe('cancelSettlement', () => {
      it.skip('should call mutations in correct order')
    })
  })

  describe('Getters', () => {
    describe('wallets', () => {
      it('should return wallets transformed from raw assets', () => {
        const state = { assets: MOCK_ASSETS }
        const result = getters.wallets(state)
        const expectedKeys = ['id', 'assetId', 'name', 'asset', 'color', 'domain', 'amount', 'precision']

        expect(result)
          .to.be.an('array')
          .which.contains.something.that.has.all.keys(expectedKeys)
      })
    })

    describe('getTransactionsByAssetId', () => {
      it('should return transformed transactions', () => {
        const state = { rawAssetTransactions: MOCK_ASSET_TRANSACTIONS }
        const result = getters.getTransactionsByAssetId(state)('omisego#test')
        const expectedKeys = [
          'amount',
          'date',
          'from',
          'to',
          'message',
          'id',
          'assetId',
          'signatures',
          'batch'
        ]

        expect(result)
          .to.be.an('array')
          .which.contains.something.that.has.all.keys(expectedKeys)
      })

      it('should return an empty array if there is no transactions', () => {
        const state = { rawAssetTransactions: {} }
        const result = getters.getTransactionsByAssetId(state)('omisego#test')

        expect(result).to.be.an('array').which.is.empty
      })
    })

    describe('waitingSettlements', () => {
      it.skip('should return only waiting settlements')

      it('should return an empty array if there is no transactions', () => {
        const state = { rawUnsignedTransactions: [] }
        const result = getters.waitingSettlements(state)

        expect(result).to.be.an('array').which.is.empty
      })
    })

    describe('resolvedSettlements', () => {
      it.skip('should return only resolved settlements')

      it('should return an empty array if there is no transactions', () => {
        const state = { rawTransactions: [] }
        const result = getters.resolvedSettlements(state)

        expect(result).to.be.an('array').which.is.empty
      })
    })
  })
})
