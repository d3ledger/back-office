import chai from 'chai'
import DashboardInjector from 'inject-loader!../../../src/store/Dashboard'
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
    ({ types, mutations, actions, getters } = DashboardInjector({
      'util/cryptoApi-axios-util': require('../../../src/util/cryptoApi-axios-util')
    }).default)
  })

  describe('Mutations', () => {
    it('RESET should reset the state', () => {
      const state = {
        portfolio: {
          assetsFullPrice: {
            diff: 555,
            value: 555,
            percent: 555
          },
          assetsPercentage: [{}, {}, {}],
          assetsHistory: [{}, {}, {}]
        },
        assetList: [{}, {}, {}],
        assetChart: {
          filter: '1Y',
          crypto: 'BTC',
          data: [{}, {}, {}]
        },
        isLoading: true,
        connectionError: null
      }
      const expectedState = {
        portfolio: {
          assetsFullPrice: {
            diff: 0,
            value: 0,
            percent: 0
          },
          assetsPercentage: [],
          assetsHistory: []
        },
        assetList: [],
        assetChart: {
          filter: '1Y',
          crypto: 'BTC',
          data: []
        },
        isLoading: false,
        connectionError: null
      }
      mutations[types.RESET](state)

      expect(state).to.be.deep.equal(expectedState)
    })

    it('GET_PORTFOLIO_FULL_PRICE should ...', () => {
      const today = randomAmountRng()
      const prevDay = randomAmountRng()
      const state = {
        portfolio: {
          assetsHistory: [{
            sum: prevDay
          }, {
            sum: today
          }]
        }
      }
      const assetsFullPrice = {
        value: today.toFixed(2),
        diff: (today - prevDay).toFixed(2),
        percent: (100 - ((prevDay * 100) / today)).toFixed(2)
      }
      mutations[types.GET_PORTFOLIO_FULL_PRICE](state)

      expect(state.portfolio)
        .to.have.property('assetsFullPrice')
        .to.be.deep.equal(assetsFullPrice)
    })

    it('GET_PORTFOLIO_PRICE_PERCENTAGE should ...', () => {
      const assets = ['BTC', 'ETH']
      const wallets = new Array(assets.length)
        .fill(null)
        .map((_, index) => ({
          amount: randomAmountRng({ max: 10 }),
          color: '#00000',
          asset: assets[index]
        }))
      const data = new Array(assets.length)
        .fill(null)
        .map((_, index) => ({
          asset: assets[index],
          value: {
            open: randomAmountRng({ max: 1000 }),
            close: randomAmountRng({ max: 1000 })
          }
        }))
      const today = {
        data: [...data],
        sum: randomAmountRng({ min: 10000 }),
        time: new Date().getTime()
      }
      const state = {
        portfolio: {
          assetsHistory: [today]
        }
      }
      mutations[types.GET_PORTFOLIO_PRICE_PERCENTAGE](state, wallets)

      const expectedKeys = ['asset', 'color', 'price', 'percent']

      expect(state.portfolio)
        .to.have.property('assetsPercentage')
        .to.be.an('array')
        .which.contains.something.that.has.all.keys(expectedKeys)
    })

    it('GET_PORTFOLIO_PRICE_LIST should ...', () => {
      const assets = [{
        asset: 'BTC',
        name: 'Bitcoin'
      }, {
        asset: 'ETH',
        name: 'Ethereum'
      }]
      const wallets = new Array(assets.length)
        .fill(null)
        .map((_, index) => ({
          amount: randomAmountRng({ max: 10 }),
          color: '#00000',
          asset: assets[index].asset,
          name: assets[index].name
        }))
      const data = () => new Array(assets.length)
        .fill(null)
        .map((_, index) => ({
          asset: assets[index].asset,
          value: {
            open: randomAmountRng({ max: 1000 }),
            close: randomAmountRng({ max: 1000 })
          }
        }))
      const history = new Array(2)
        .fill(null)
        .map(() => ({
          data: [...data()],
          sum: randomAmountRng(),
          time: new Date().getTime()
        }))
      const state = {
        portfolio: {
          assetsHistory: [...history]
        }
      }
      mutations[types.GET_PORTFOLIO_PRICE_LIST](state, wallets)
      const expectedKeys = ['asset', 'name', 'price', 'diff', 'percent']

      expect(state.assetList)
        .to.be.an('array')
        .which.contains.something.that.has.all.keys(expectedKeys)
    })

    it('SELECT_CHART_FILTER should ...', () => {
      const filter = randomArrayElement(['1W', '1M', '1Y'])
      const state = { assetChart: {} }
      mutations[types.SELECT_CHART_FILTER](state, filter)
      expect(state.assetChart)
        .to.have.property('filter')
        .to.be.deep.equal(filter)
    })

    it('SELECT_CHART_CRYPTO should ...', () => {
      const crypto = randomArrayElement(['BTC', 'ETH', 'XRP'])
      const state = { assetChart: {} }
      mutations[types.SELECT_CHART_CRYPTO](state, crypto)
      expect(state.assetChart)
        .to.have.property('crypto')
        .to.be.equal(crypto)
    })

    it('GET_PRICE_BY_FILTER_SUCCESS should ...', () => {
      const size = randomAmountRng({ max: 700 })
      const data = new Array(size)
        .fill(null)
        .map(() => ({
          open: randomAmountRng(),
          close: randomAmountRng(),
          low: randomAmountRng(),
          high: randomAmountRng(),
          time: new Date().getTime(),
          volumefrom: randomAmountRng(),
          volumeto: randomAmountRng()
        }))
      const state = { assetChart: {} }
      mutations[types.GET_PRICE_BY_FILTER_SUCCESS](state, data)

      expect(state.assetChart)
        .to.have.property('data')
        .to.be.deep.equal(data)
    })

    it('GET_PORTFOLIO_HISTORY_SUCCESS should ...', () => {
      const size = randomAmountRng({ max: 50 })
      const history = new Array(size)
        .fill(null)
        .map(() => ({
          data: [],
          sum: randomAmountRng(),
          time: new Date().getTime()
        }))
      const state = { portfolio: {} }
      mutations[types.GET_PORTFOLIO_HISTORY_SUCCESS](state, history)

      expect(state.portfolio)
        .to.have.property('assetsHistory')
        .to.be.deep.equal(history)
    })

    it('LOAD_DASHBOARD_SUCCESS should ...', () => {
      const state = {
        isLoading: true
      }
      const expectedState = {
        isLoading: false
      }
      mutations[types.LOAD_DASHBOARD_SUCCESS](state)

      expect(state).to.be.deep.equal(expectedState)
    })
  })

  describe('Actions', () => {
    it('ACTION TEST', () => {
      const action = actions
      expect('TEST').to.be.a('IMPLEMENTED', action)
    })
  })

  describe('Getters', () => {
    it('GETTER TESTS', () => {
      const getter = getters
      expect('TEST').to.be.a('IMPLEMENTED', getter)
    })
  })
})
