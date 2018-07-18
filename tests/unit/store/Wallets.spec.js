import chai from 'chai'
import sinon from 'sinon'
import WalletInjector from 'inject-loader!../../../src/store/Wallet'
import helper from '../helper'

const {
  randomAmountRng,
  randomArrayElement
} = helper
const expect = chai.expect

chai.use(require('chai-things'))

describe('Dashboard store', () => {
  let types, mutations, actions, getters

  beforeEach(() => {
    ({ types, mutations, actions, getters } = WalletInjector({
      'util/cryptoApi-axios-util': require('../../../src/util/cryptoApi-axios-util')
    }).default)
  })

  describe('Mutations', () => {
    it('RESET should reset the state', () => {
      const state = {
        cryptoInfo: {
          current: {
            rur: randomAmountRng(),
            rur_change: randomAmountRng(),
            crypto: randomAmountRng(),
            crypto_change: randomAmountRng()
          },
          market: {
            cap: {
              rur: randomAmountRng(),
              crypto: randomAmountRng()
            },
            volume: {
              rur: randomAmountRng(),
              crypto: randomAmountRng()
            },
            supply: randomAmountRng()
          },
          isLoading: true
        },
        connectionError: new Error()
      }
      const expectedState = {
        cryptoInfo: {
          current: {
            rur: 0,
            rur_change: 0,
            crypto: 0,
            crypto_change: 0
          },
          market: {
            cap: {
              rur: 0,
              crypto: 0
            },
            volume: {
              rur: 0,
              crypto: 0
            },
            supply: 0
          },
          isLoading: false
        },
        connectionError: null
      }
      mutations[types.RESET](state)

      expect(state).to.be.deep.equal(expectedState)
    })

    it('GET_CRYPTO_FULL_DATA_REQUEST should set loading to true', () => {
      const state = { cryptoInfo: { isLoading: false } }
      const expectedState = { cryptoInfo: { isLoading: true } }
      mutations[types.GET_CRYPTO_FULL_DATA_REQUEST](state)
      expect(state).to.be.deep.equal(expectedState)
    })

    it('GET_CRYPTO_FULL_DATA_SUCCESS should set cryptoInfo data', () => {
      const state = { cryptoInfo: {} }
      const number = randomAmountRng()
      const RAW = {
        test: {
          RUB: {
            PRICE: number,
            CHANGEDAY: number,
            MKTCAP: number,
            SUPPLY: number,
            TOTALVOLUME24HTO: number,
            TOTALVOLUME24H: number
          },
          BTC: {
            PRICE: number,
            CHANGEPCTDAY: number
          }
        }
      }
      const expectedState = {
        cryptoInfo: {
          current: {
            rur: number,
            rur_change: number,
            crypto: number,
            crypto_change: number
          },
          market: {
            cap: {
              rur: number,
              crypto: number
            },
            volume: {
              rur: number,
              crypto: number
            },
            supply: number
          },
          isLoading: false
        }
      }
      mutations[types.GET_CRYPTO_FULL_DATA_SUCCESS](state, { RAW })
      expect(state).to.be.deep.equal(expectedState)
    })

    it('GET_CRYPTO_FULL_DATA_FAILURE should set loading to fasle and set error', () => {
      const state = { cryptoInfo: { isLoading: true } }
      const err = new Error()
      const expectedState = {
        cryptoInfo: { isLoading: false },
        connectionError: err
      }
      mutations[types.GET_CRYPTO_FULL_DATA_FAILURE](state, err)
      expect(state).to.be.deep.equal(expectedState)
    })
  })

  describe('Actions', () => {
    describe('getCryptoFullData', () => {
      it('should call mutations in correct order', async () => {
        const assets = ['BTC', 'ETH']
        const asset = randomArrayElement(assets)
        const commit = sinon.spy()
        await actions.getCryptoFullData({ commit }, { asset })
        const response = commit.secondCall.args[1]
        expect(commit.args).to.deep.equal([
          [types.GET_CRYPTO_FULL_DATA_REQUEST],
          [types.GET_CRYPTO_FULL_DATA_SUCCESS, response]
        ])
      })
    })
  })

  describe('Getters', () => {
    describe('cryptoInfo', () => {
      it('should return object that haves market prices', () => {
        const state = {
          cryptoInfo: {
            current: {
              rur: randomAmountRng(),
              rur_change: randomAmountRng(),
              crypto: randomAmountRng(),
              crypto_change: randomAmountRng()
            },
            market: {
              cap: {
                rur: randomAmountRng(),
                crypto: randomAmountRng()
              },
              volume: {
                rur: randomAmountRng(),
                crypto: randomAmountRng()
              },
              supply: randomAmountRng()
            },
            isLoading: false
          }
        }
        const result = getters.cryptoInfo(state)
        expect(result)
          .to.have.property('current')
          .to.be.deep.equal(state.cryptoInfo.current)
        expect(result)
          .to.have.property('market')
          .to.be.equal(state.cryptoInfo.market)
      })
    })
  })
})
