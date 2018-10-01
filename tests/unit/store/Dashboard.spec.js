import chai from 'chai'
import sinon from 'sinon'
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
      '@util/cryptoApi-axios-util': require('@util/cryptoApi-axios-util')
    }).default)
  })

  describe('Mutations', () => {
    function testErrorHandling (type) {
      it(`${type} should set connectionError`, () => {
        const state = { connectionError: null }
        const error = new Error()
        expect(state.connectionError).to.be.a('null')
        mutations[types[type]](state, error)
        expect(state.connectionError).to.equal(error)
      })
    }

    it('RESET should reset the state', () => {
      const state = {
        portfolio: {
          assetsFullPrice: {
            diff: 555,
            value: 555,
            percent: 555
          },
          assetsPercentage: [{}, {}, {}],
          assetsHistory: [{}, {}, {}],
          filter: 'ALL'
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
          assetsHistory: [],
          filter: '1W'
        },
        assetList: [],
        assetChart: {
          filter: '1Y',
          crypto: null,
          data: []
        },
        isLoading: false,
        connectionError: null
      }
      mutations[types.RESET](state)

      expect(state).to.be.deep.equal(expectedState)
    })

    it('GET_PORTFOLIO_FULL_PRICE should calculte value, difference and percent difference', () => {
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

    it('GET_PORTFOLIO_PRICE_PERCENTAGE should calculate array of objects with data for pie chart', () => {
      const assets = ['BTC', 'ETH']
      const wallets = assets
        .map((_, index) => ({
          amount: randomAmountRng({ max: 10 }),
          color: '#00000',
          asset: assets[index]
        }))
      const data = assets
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

    it('GET_PORTFOLIO_PRICE_LIST should calculate array of objects width data for table list of cryptocurrencies', () => {
      const assets = [{
        asset: 'BTC',
        name: 'Bitcoin'
      }, {
        asset: 'ETH',
        name: 'Ethereum'
      }]
      const wallets = assets
        .map((_, index) => ({
          amount: randomAmountRng({ max: 10 }),
          color: '#00000',
          asset: assets[index].asset,
          name: assets[index].name
        }))
      const data = () => assets
        .map((_, index) => ({
          asset: assets[index].asset,
          value: {
            open: randomAmountRng({ max: 1000 }),
            close: randomAmountRng({ max: 1000 })
          }
        }))
      const history = assets
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

    it('SELECT_CHART_FILTER should change filter of chart', () => {
      const filter = randomArrayElement(['1Y', '1M', '1W', '1D', '1H'])
      const state = { assetChart: {} }
      mutations[types.SELECT_CHART_FILTER](state, filter)
      expect(state.assetChart)
        .to.have.property('filter')
        .to.be.deep.equal(filter)
    })

    it('SELECT_CHART_CRYPTO should change cryptocurrency of chart', () => {
      const crypto = randomArrayElement(['BTC', 'ETH', 'XRP'])
      const state = { assetChart: {} }
      mutations[types.SELECT_CHART_CRYPTO](state, crypto)
      expect(state.assetChart)
        .to.have.property('crypto')
        .to.be.equal(crypto)
    })

    it('GET_PRICE_BY_FILTER_SUCCESS should set data', () => {
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

    testErrorHandling('GET_PRICE_BY_FILTER_FAILURE')

    it('GET_PORTFOLIO_HISTORY_SUCCESS should set data', () => {
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

    testErrorHandling('GET_PORTFOLIO_HISTORY_FAILURE')

    it('LOAD_DASHBOARD_SUCCESS should change lodaing state to TRUE', () => {
      const state = {
        isLoading: true
      }
      const expectedState = {
        isLoading: false
      }
      mutations[types.LOAD_DASHBOARD_SUCCESS](state)

      expect(state).to.be.deep.equal(expectedState)
    })

    testErrorHandling('LOAD_DASHBOARD_FAILURE')
  })

  describe('Actions', () => {
    describe('loadDashboard', () => {
      it.skip('should call mutations in correct order')
    })

    describe('getPortfolioHistory', () => {
      it('should call mutations in correct order', async () => {
        const assets = ['BTC', 'ETH']
        const wallets = assets
          .map((_, index) => ({
            amount: randomAmountRng({ max: 10 }),
            color: '#00000',
            asset: assets[index]
          }))
        const commit = sinon.spy()
        const getters = {
          wallets,
          settingsView: {
            fiat: randomArrayElement(['USD', 'EUR', 'RUB']),
            crypto: randomArrayElement(['BTC', 'ETH', 'XRP'])
          }
        }
        const filter = randomArrayElement(['1Y', '1M', '1W', '1D', '1H'])
        await actions.getPortfolioHistory({ commit, getters }, { filter })

        const response = commit.thirdCall.args[1]

        expect(commit.args).to.deep.equal([
          [types.SELECT_PORTFOLIO_FILTER, filter],
          [types.GET_PORTFOLIO_HISTORY_REQUEST],
          [types.GET_PORTFOLIO_HISTORY_SUCCESS, response]
        ])
      })
    })

    describe('getPriceByFilter', () => {
      it('should call mutations in correct order', async () => {
        const commit = sinon.spy()
        const data = {
          filter: randomArrayElement(['1Y', '1M', '1W', '1D', '1H']),
          crypto: randomArrayElement(['BTC', 'ETH', 'XRP'])
        }
        const getters = {
          wallets: [],
          settingsView: {
            fiat: randomArrayElement(['USD', 'EUR', 'RUB']),
            crypto: randomArrayElement(['BTC', 'ETH', 'XRP'])
          },
          portfolioChart: {
            filter: data.filter,
            crypto: data.crypto
          }
        }
        const state = { assetChart: {} }
        await actions.getPriceByFilter({ commit, getters, state }, data)

        const response = commit.getCall(3).args[1]

        expect(commit.args).to.deep.equal([
          [types.SELECT_CHART_CRYPTO, data.crypto],
          [types.SELECT_CHART_FILTER, data.filter],
          [types.GET_PRICE_BY_FILTER_REQUEST],
          [types.GET_PRICE_BY_FILTER_SUCCESS, response]
        ])
      })
    })
  })

  describe('Getters', () => {
    describe('portfolioPrice', () => {
      it('should return object that haves diff, value, percent', () => {
        const state = {
          portfolio: {
            assetsFullPrice: {
              diff: randomAmountRng(),
              value: randomAmountRng(),
              percent: randomAmountRng()
            }
          }
        }
        const result = getters.portfolioPrice(state)
        expect(result)
          .to.have.property('diff')
          .to.be.equal(state.portfolio.assetsFullPrice.diff)
        expect(result)
          .to.have.property('value')
          .to.be.equal(state.portfolio.assetsFullPrice.value)
        expect(result)
          .to.have.property('percent')
          .to.be.equal(state.portfolio.assetsFullPrice.percent)
      })
    })
    describe('portfolioPercent', () => {
      it('should return empty array', () => {
        const state = {
          portfolio: {
            assetsPercentage: []
          }
        }
        const result = getters.portfolioPercent(state)
        expect(result).to.be.an('array').which.is.empty
      })
    })
    describe('portfolioChart', () => {
      it('should return object that haves data, current filter and cryptocurrency', () => {
        const state = {
          assetChart: {
            filter: '1Y',
            crypto: 'BTC',
            data: []
          }
        }
        const result = getters.portfolioChart(state)
        expect(result)
          .to.have.property('filter')
          .to.be.equal('1Y')
        expect(result)
          .to.have.property('crypto')
          .to.be.equal('BTC')
        expect(result)
          .to.have.property('data')
          .to.be.an('array').which.is.empty
      })
    })
    describe('portfolioHistory', () => {
      it('should return empty array', () => {
        const state = {
          portfolio: {
            assetsHistory: []
          }
        }
        const result = getters.portfolioHistory(state)
        expect(result).to.be.an('array').which.is.empty
      })
    })
    describe('portfolioList', () => {
      it('should return empty array', () => {
        const state = { assetList: [] }
        const result = getters.portfolioList(state)
        expect(result).to.be.an('array').which.is.empty
      })
    })
    describe('connectionError', () => {
      it('should return null', () => {
        const state = { connectionError: null }
        const result = getters.connectionError(state)
        expect(result).to.be.a('null')
      })
    })
    describe('isDashboardLoading', () => {
      it('should return false', () => {
        const state = { isLoading: false }
        const result = getters.isDashboardLoading(state)
        expect(result).to.be.false
      })
    })
  })
})
