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

describe('Wallet store', () => {
  let types, mutations, actions, getters

  beforeEach(() => {
    ({ types, mutations, actions, getters } = WalletInjector({
      '@util/cryptoApi-axios-util': require('../../../src/util/cryptoApi-axios-util')
    }).default)
  })

  describe('Mutations', () => {
    it('RESET should reset the state', () => {
      const state = {
        cryptoInfo: {
          current: {
            fiat: randomAmountRng(),
            fiat_change: randomAmountRng(),
            crypto: randomAmountRng(),
            crypto_change: randomAmountRng()
          },
          market: {
            cap: {
              fiat: randomAmountRng(),
              crypto: randomAmountRng()
            },
            volume: {
              fiat: randomAmountRng(),
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
            fiat: 0,
            fiat_change: 0,
            crypto: 0,
            crypto_change: 0
          },
          market: {
            cap: {
              fiat: 0,
              crypto: 0
            },
            volume: {
              fiat: 0,
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
      const price = randomAmountRng()
      const assets = ['BTC', 'ETH']
      const fiats = ['USD', 'EUR']
      const asset = randomArrayElement(assets)
      const fiat = randomArrayElement(fiats)
      const currencies = {
        fiat,
        crypto: asset
      }
      const historicalDataFiat = {
        Data: [
          { close: number },
          { close: number }
        ]
      }
      const historicalDataCrypto = {
        Data: [
          { close: number },
          { close: number }
        ]
      }
      const volumeData = {
        Data: [
          { volume: number },
          { volume: number }
        ]
      }
      const priceData = {
        RAW: {
          test: {
            [fiat]: {
              PRICE: price,
              CHANGEDAY: number,
              MKTCAP: number,
              SUPPLY: number,
              TOTALVOLUME24HTO: number,
              TOTALVOLUME24H: number
            },
            [asset]: {
              PRICE: price,
              CHANGEPCTDAY: number
            }
          }
        }
      }
      const expectedState = {
        cryptoInfo: {
          current: {
            fiat: price,
            fiat_change: 0,
            crypto: price,
            crypto_change: 0
          },
          market: {
            cap: {
              fiat: number,
              crypto: number
            },
            volume: {
              fiat: price * (number * 2),
              crypto: number * 2
            },
            supply: number
          },
          isLoading: false
        }
      }
      mutations[types.GET_CRYPTO_FULL_DATA_SUCCESS](state, {
        historicalDataFiat,
        historicalDataCrypto,
        volumeData,
        priceData,
        currencies
      })
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
        const fiats = ['USD', 'EUR']
        const filter = '1D'
        const asset = randomArrayElement(assets)
        const fiat = randomArrayElement(fiats)
        const getters = {
          settingsView: {
            fiat,
            crypto: asset
          }
        }
        const commit = sinon.spy()
        await actions.getCryptoFullData({ commit, getters }, { filter, asset })
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
              fiat: randomAmountRng(),
              fiat_change: randomAmountRng(),
              crypto: randomAmountRng(),
              crypto_change: randomAmountRng()
            },
            market: {
              cap: {
                fiat: randomAmountRng(),
                crypto: randomAmountRng()
              },
              volume: {
                fiat: randomAmountRng(),
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
