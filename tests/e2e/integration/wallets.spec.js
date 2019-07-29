const testKeyPath = 'test@d3.priv'
const aliceKeyPath = 'alice@d3.priv'

const TOKEN_BAT = 'BasicAttentionToken'
const TOKEN_REP = 'Augur'

const mockUserRequest = () => {
  cy.server()
  cy.route(
    'http://localhost:8087/iroha/account/exists?*',
    'fixture:data-collector-api/user.json'
  ).as('getUserInfo')
}

describe('Test wallets page without white list', () => {
  it('Make auth', () => {
    cy.visit('/')
    cy.login(aliceKeyPath)
  })

  it('Go to wallets page', () => {
    cy.goToPage('wallets', 'Wallets')
  })

  describe('Test sorting', () => {
    it('Sort wallets with alphabetical descending order', () => {
      cy.get('#wallets-sort-button').click({ force: true })
      cy.get('.el-dropdown-menu__item:contains("alphabetical (desc)")').click({ force: true })

      cy.get('a.card .label').first().invoke('text').as('firstWalletName')
      cy.get('a.card .label').last().invoke('text').as('lastWalletName')

      cy.get('@firstWalletName').then(firstWalletName => {
        cy.get('@lastWalletName').should('lte', firstWalletName)
      })
    })

    it('Sort wallets with alphabetical ascending order', () => {
      cy.get('#wallets-sort-button').click({ force: true })
      cy.get('.el-dropdown-menu__item:contains("alphabetical (asc)")').click({ force: true })

      cy.get('a.card .label').first().invoke('text').as('firstWalletName')
      cy.get('a.card .label').last().invoke('text').as('lastWalletName')

      cy.get('@firstWalletName').then(firstWalletName => {
        cy.get('@lastWalletName').should('gte', firstWalletName)
      })
    })
  })

  describe('Test search', () => {
    it('Search for wallet', () => {
      cy.get('.el-input__inner')
        .type(TOKEN_BAT).should('have.value', TOKEN_BAT)
      cy.get('aside').find('a.card').should('have.length', 1)
    })

    it('Open wallet', () => {
      cy.get('a.card').first().click()
      cy.url().should('contain', TOKEN_BAT.toLowerCase())
      cy.get('.card_header').first().should('contain', TOKEN_BAT)
    })
  })

  describe('Test deposit modal', () => {
    it('Open modal', () => {
      cy.get('[data-cy=deposit]').click()
      cy.get('[data-cy=depositModal]').should('be.visible')
    })

    it('QR Code value and address are equal', () => {
      cy.get('[data-cy=deposit-address]').then(($span) => {
        cy.get('canvas').parent()
          .should('have.attr', 'value', $span.text())
      })
    })

    it('Close modal', () => {
      cy.get('[data-cy=depositModal]').find('i').click()
      cy.get('[data-cy=depositModal]').should('not.be.visible')
    })
  })

  // Need to have white list address before perform this test
  describe.skip('Test withdraw modal', () => {
    it('Open modal', () => {
      cy.get('[data-cy=withdraw]').click()
      cy.get('[data-cy=withdrawalModal]').should('be.visible')
    })

    it('Validate amount field', () => {
      const tokenAmount = '0.1'
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate wallet field', () => {
      const tokenAmount = '0.1'
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - handle an error', () => {
      cy.get('[data-cy=withdrawalModal]')
        .find('.el-form-item__content > .el-button')
        .click()
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - correct', () => {
      const tokenAmount = '0.1'
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('[data-cy=withdrawalModal]')
        .find('.el-select > .el-input > .el-input__inner')
        .click()
      cy.get('.el-select-dropdown__item')
        .click()
      cy.get('[data-cy=withdrawalModal]')
        .find('.el-form-item__content > .el-button')
        .click()
      // cy.get('[data-cy=withdrawalModal]')
      //   .get('[data-cy=confirmModal]')
      //   .should('be.visible')
    })

    it.skip('Validate approval dialog - handle an error', () => {
      cy.wrap('invalid_private_key').as('invalidPrivateKey')

      cy.get('[data-cy=confirmModal] .el-input')
        .each(function ($el, index) {
          cy.wrap($el).find('.el-input__inner')
            .clear()
            .type(this.invalidPrivateKey)
            .should('have.value', this.invalidPrivateKey)

          cy.get('[data-cy=confirmModal] .el-form-item__error').eq(index)
            .should('be.visible')
        })

      cy.get('#confirm-approval-form')
        .should('be.disabled')
    })

    it.skip('Validate approval dialog - correct', () => {
      cy.wrap('0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33').as('validPrivateKey')

      cy.get('[data-cy=confirmModal] .el-input')
        .each(function ($el, index) {
          cy.wrap($el).find('.el-input__inner')
            .clear()
            .type(this.validPrivateKey)
            .should('have.value', this.validPrivateKey)
        })

      cy.get('#confirm-approval-form')
        .should('not.be.disabled')
    })

    it('Close approval modal', () => {
      cy.get('[data-cy=confirmModal] i.el-dialog__close').click()
    })

    it('Close modal', () => {
      cy.get('[data-cy=withdrawalModal] i.el-dialog__close').click()
      cy.get('[data-cy=withdrawalModal]').should('not.be.visible')
    })
  })

  describe('Test transfer modal', () => {
    it('Open modal', () => {
      cy.get('[data-cy=transfer]').click()
      cy.get('[data-cy=transferModal]').should('be.visible')
    })

    it('Validate amount field', () => {
      const tokenAmount = '0.1'
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate account field', () => {
      const account = 'test@d3'
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .type(account)
        .should('have.value', account)
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - handle an error', () => {
      cy.get('[data-cy=transferModal]')
        .find('.el-dialog__body > .el-button')
        .click()
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - correct', () => {
      mockUserRequest()
      const tokenAmount = '0.1'
      const account = 'test@d3'
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .type(account)
        .should('have.value', account)
      cy.wait('@getUserInfo')
      cy.get('[data-cy=transferModal]')
        .find('.el-dialog__body > .el-button')
        .click()
      // cy.get('[data-cy=confirmModal]').should('be.visible')
      // cy.get('[data-cy=confirmModal] i.el-dialog__close').click()
    })

    it('Close modal', () => {
      cy.get('[data-cy=transferModal] i.el-dialog__close')
        .click()
      cy.get('[data-cy=transferModal]')
        .should('not.be.visible')
    })
  })

  describe('Test exchange modal', () => {
    it('Open modal', () => {
      cy.get('[data-cy=exchange]').click()
      cy.get('[data-cy=exchangeModal]').should('be.visible')
    })

    it('Validate first amount field', () => {
      const tokenAmount = '0.1'
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate second amount field', () => {
      const tokenAmount = '0.2'
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible').should('contain', 'Please select asset')
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Select second token', () => {
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-input-group > .el-input-group__append > .el-select > .el-input > .el-input__inner')
        .click()
      cy.get('.el-scrollbar > .el-select-dropdown__wrap > .el-scrollbar__view')
        .find(':nth-child(4) > span').eq(1)
        .click()
      cy.get('[data-cy=exchangeModal]')
        .find('.el-dialog__body > .el-form > :nth-child(4)')
        .should('be.visible')
    })

    it('Validate account field', () => {
      const account = 'test@d3'
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(5) > .el-form-item__content > .el-input > .el-input__inner')
        .type(account)
        .should('have.value', account)
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(5) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(5) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(5) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - handle an error', () => {
      cy.get('[data-cy=exchangeModal]')
        .find('.el-dialog__body > .el-button')
        .click()
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(5) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - correct', () => {
      mockUserRequest()
      const tokenAmountFirst = '0.1'
      const tokenAmountSecond = '0.2'
      const account = 'test@d3'
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmountFirst)
        .should('have.value', tokenAmountFirst)
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmountSecond)
        .should('have.value', tokenAmountSecond)
      cy.get('[data-cy=exchangeModal]')
        .find(':nth-child(5) > .el-form-item__content > .el-input > .el-input__inner')
        .type(account)
        .should('have.value', account)
      cy.wait('@getUserInfo')
      cy.get('[data-cy=exchangeModal]')
        .find('.el-dialog__body > .el-button')
        .click()
      // cy.get('[data-cy=confirmModal]').should('be.visible')
      // cy.get('[data-cy=confirmModal] i.el-dialog__close').click()
    })

    it('Close modal', () => {
      cy.get('[data-cy=exchangeModal] i.el-dialog__close').click()
      cy.get('[data-cy=exchangeModal]').should('not.be.visible')
    })
  })
})

describe('Test wallets page with white list', () => {
  it('Make auth', () => {
    cy.visit('/')
    cy.login(testKeyPath)
  })

  it('Go to wallets page', () => {
    cy.goToPage('wallets', 'Wallets')
  })

  describe('Test withdraw modal', () => {
    it('Open modal', () => {
      cy.contains('Withdraw').click()
      cy.get('[data-cy=withdrawalModal]').should('be.visible')
    })

    it('Validate amount field', () => {
      const tokenAmount = '0.1'
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - handle an error', () => {
      cy.get('[data-cy=withdrawalModal]')
        .find('.el-form-item__content > .el-button')
        .click()
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - correct', () => {
      const tokenAmount = '0.1'
      cy.get('[data-cy=withdrawalModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('[data-cy=withdrawalModal]')
        .find('.el-select > .el-input > .el-input__inner')
        .click()
      cy.get('.el-select-dropdown__item')
        .click()
      cy.get('[data-cy=withdrawalModal]')
        .find('.el-form-item__content > .el-button')
        .click()
      // cy.get('[data-cy=withdrawalModal]')
      //   .get('[data-cy=confirmModal]')
      //   .should('be.visible')
    })

    it.skip('Validate approval dialog - handle an error', () => {
      cy.wrap('invalid_private_key').as('invalidPrivateKey')

      cy.get('[data-cy=confirmModal] .el-input')
        .each(function ($el, index) {
          cy.wrap($el).find('.el-input__inner')
            .clear()
            .type(this.invalidPrivateKey)
            .should('have.value', this.invalidPrivateKey)

          cy.get('[data-cy=confirmModal] .el-form-item__error').eq(index)
            .should('be.visible')
        })

      cy.get('#confirm-approval-form')
        .should('be.disabled')
    })

    it.skip('Validate approval dialog - correct', () => {
      cy.wrap('0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33').as('validPrivateKey')

      cy.get('[data-cy=confirmModal] .el-input')
        .each(function ($el, index) {
          cy.wrap($el).find('.el-input__inner')
            .clear()
            .type(this.validPrivateKey)
            .should('have.value', this.validPrivateKey)
        })

      cy.get('#confirm-approval-form')
        .should('not.be.disabled')
    })

    it.skip('Close approval modal', () => {
      cy.get('[data-cy=confirmModal] i.el-dialog__close').click()
    })

    it('Close modal', () => {
      cy.get('[data-cy=withdrawalModal] i.el-dialog__close').click()
      cy.get('[data-cy=withdrawalModal]').should('not.be.visible')
    })
  })
})

describe('Test transfer with one private key', () => {
  it('Make auth', () => {
    cy.visit('/')
    cy.login(aliceKeyPath)
  })

  it('Go to wallets page', () => {
    cy.goToPage('wallets', 'Wallets')
  })

  it('Open wallet', () => {
    cy.get('.el-input__inner')
      .type(TOKEN_REP).should('have.value', TOKEN_REP)
    cy.get('a.card').first().click()
    cy.url().should('contain', TOKEN_REP.toLowerCase())
    cy.get('.card_header').first().should('contain', TOKEN_REP)
  })

  describe('Test transfer with one key', () => {
    it('Open modal', () => {
      cy.get('[data-cy=transfer]').click()
      cy.get('[data-cy=transferModal]').should('be.visible')
    })

    it('Validate modal - correct', () => {
      mockUserRequest()
      const tokenAmount = '0.001'
      const account = 'test@d3'
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .type(account)
        .should('have.value', account)
      cy.wait('@getUserInfo')
      cy.get('[data-cy=transferModal]')
        .find('.el-dialog__body > .el-button')
        .click()
    })

    it.skip('Enter one private key and send', () => {
      cy.wrap('9c430dfe8c54b0a447e25f75121119ac3b649c1253bce8420f245e4c104dccd1').as('validPrivateKey')
      cy.get('[data-cy=confirmModal] .el-input')
        .each(function ($el, index) {
          cy.wrap($el).find('.el-input__inner')
            .type(this.validPrivateKey)
            .should('have.value', this.validPrivateKey)
        })
      cy.get('#confirm-approval-form').click({ force: true })
      cy.waitForConfirmation()
    })

    it.skip('Handle success message', () => {
      cy.get('.el-message', { timeout: 10000 }).should('be.visible')
    })
  })
})

describe('Test transfer with two private keys', () => {
  it('Make auth', () => {
    cy.visit('/')
    cy.login(testKeyPath)
  })

  it('Go to wallets page', () => {
    cy.goToPage('wallets', 'Wallets')
  })

  it('Open wallet', () => {
    cy.get('.el-input__inner')
      .type(TOKEN_REP).should('have.value', TOKEN_REP)
    cy.get('a.card').first().click()
    cy.url().should('contain', TOKEN_REP.toLowerCase())
    cy.get('.card_header').first().should('contain', TOKEN_REP)
  })

  describe('Test transfer with two keys', () => {
    it('Open modal', () => {
      cy.get('[data-cy=transfer]').click()
      cy.get('[data-cy=transferModal]').should('be.visible')
    })

    it('Validate modal - correct', () => {
      mockUserRequest()
      const tokenAmount = '0.001'
      const account = 'alice@d3'
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .type(account)
        .should('have.value', account)
      cy.wait('@getUserInfo')
      cy.get('[data-cy=transferModal]')
        .find('.el-dialog__body > .el-button')
        .click()
    })

    it.skip('Enter two private keys and send', () => {
      cy.wrap('0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33').as('validPrivateKey1')
      cy.wrap('9c430dfe8c54b0a447e25f75121119ac3b649c1253bce8420f245e4c104dccd1').as('validPrivateKey2')
      cy.get('[data-cy=confirmModal] .el-input')
        .each(function ($el, index) {
          if (index === 0) {
            cy.wrap($el).find('.el-input__inner')
              .type(this.validPrivateKey1)
              .should('have.value', this.validPrivateKey1)
          } else {
            cy.wrap($el).find('.el-input__inner')
              .type(this.validPrivateKey2)
              .should('have.value', this.validPrivateKey2)
          }
        })
      cy.get('#confirm-approval-form').click({ force: true })
      cy.waitForConfirmation()
    })

    it.skip('Handle success message', () => {
      cy.get('.el-message', { timeout: 10000 }).should('be.visible')
    })
  })
})

describe('Test transfer with one private key and quorum 2', () => {
  it('Make auth', () => {
    cy.visit('/')
    cy.login(testKeyPath)
  })

  it('Go to wallets page', () => {
    cy.goToPage('wallets', 'Wallets')
  })

  it('Open wallet', () => {
    cy.get('.el-input__inner')
      .type(TOKEN_REP).should('have.value', TOKEN_REP)
    cy.get('a.card').first().click()
    cy.url().should('contain', TOKEN_REP.toLowerCase())
    cy.get('.card_header').first().should('contain', TOKEN_REP)
  })

  describe('Test transfer with one key and quorum 2', () => {
    it('Open modal', () => {
      cy.get('[data-cy=transfer]').click()
      cy.get('[data-cy=transferModal]').should('be.visible')
    })

    it('Validate modal - correct', () => {
      mockUserRequest()
      const tokenAmount = '0.001'
      const account = 'alice@d3'
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('[data-cy=transferModal]')
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .type(account)
        .should('have.value', account)
      cy.wait('@getUserInfo')
      cy.get('[data-cy=transferModal]')
        .find('.el-dialog__body > .el-button')
        .click()
    })

    it.skip('Enter one private key', () => {
      cy.wrap('0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33').as('validPrivateKey1')
      cy.get('[data-cy=confirmModal] .el-input')
        .each(function ($el, index) {
          if (index === 0) {
            cy.wrap($el).find('.el-input__inner')
              .type(this.validPrivateKey1)
              .should('have.value', this.validPrivateKey1)
          }
        })
      cy.get('#confirm-approval-form').click({ force: true })
      cy.waitForConfirmation()
    })

    it.skip('Go to transactions page', () => {
      cy.goToPage('transactions', 'Transactions')
    })

    it.skip('Open add signature modal', () => {
      cy.get('.transaction_action > .el-button').eq(0).click()
    })

    it.skip('Enter second private key', () => {
      const validPrivateKey2 = '9c430dfe8c54b0a447e25f75121119ac3b649c1253bce8420f245e4c104dccd1'
      cy.get('[data-cy=confirmModal] .el-input__inner')
        .type(validPrivateKey2)
        .should('have.value', validPrivateKey2)
      cy.get('#confirm-approval-form').click({ force: true })
      cy.waitForConfirmation()
    })
  })
})
