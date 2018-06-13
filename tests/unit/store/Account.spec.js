import { expect } from 'chai'
import AccountInjector from 'inject-loader!../../../src/store/Account.js'

describe('Account store', () => {
  describe('mutations', () => {
    let types, mutations

    beforeEach(() => {
      const Account = AccountInjector({
        'util/iroha-util': require('../../../src/util/iroha-util'),
        'util/iroha-amount': require('../../../src/util/iroha-amount')
      }).default

      types = Account.types
      mutations = Account.mutations
    })

    it('LOGIN_SUCCESS should set an accountId', () => {
      const state = {}
      const account = { accountId: 'a@b' }

      mutations[types.LOGIN_SUCCESS](state, account)

      expect(state.accountId).to.equal(account.accountId)
    })

    const codes = ['UNAVAILABLE', 'CANCELLED']
    codes.forEach(codeName => {
      it(`LOGIN_FAILURE should treat grpc ${codeName} as a connection error`, () => {
        const grpc = require('grpc')
        const state = {}
        const error = { code: grpc.status[codeName] }

        expect(state.connectionError).to.be.undefined

        mutations[types.LOGIN_FAILURE](state, error)

        expect(state.connectionError).to.equal(error)
      })
    })
  })
})
