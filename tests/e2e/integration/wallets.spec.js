const testKeyPath = 'test@notary.priv'
const aliceKeyPath = 'alice@notary.priv'

const TOKEN = 'BasicAttentionToken'

describe('Test wallets page without white list', () => {
  before(() => {
    cy.server()
    cy.route('GET', '/data/histoday*limit=30', 'fixture:crypto-api/histoday30.json')
    cy.route('GET', '/data/histoday*limit=365', 'fixture:crypto-api/histoday365.json').as('getHistoday365')
  })

  it('Make auth', () => {
    cy.visit('/')
    cy.login(aliceKeyPath)
    cy.wait('@getHistoday365')
  })

  it('Go to wallets page', () => {
    cy.get('.el-side-menu .el-menu-item:contains("Wallets")').click({ force: true })
    cy.url().should('contain', 'wallets')
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
        .type(TOKEN).should('have.value', TOKEN)
      cy.get('aside').find('a.card').should('have.length', 1)
    })

    it('Open wallet', () => {
      cy.get('a.card').first().click()
      cy.url().should('contain', TOKEN.toLowerCase())
      cy.get('.card_header').first().should('contain', TOKEN)
    })
  })

  describe('Test deposit modal', () => {
    it('Open modal', () => {
      cy.get('[data-cy=deposit]').click()
      cy.get('div.el-dialog').eq(1).should('be.visible')
    })

    it.skip('Wallet address expect to be valid', () => {})

    it.skip('QR Code value and address are equal', () => {
    })

    it('Close modal', () => {
      cy.get('i.el-dialog__close').eq(1).click()
      cy.get('div.el-dialog').eq(1).should('not.be.visible')
    })
  })

  describe('Test withdraw modal', () => {
    it('Open modal', () => {
      cy.get('[data-cy=withdraw]').click()
      cy.get('div.el-dialog').eq(0).should('be.visible')
    })

    it('Validate amount field', () => {
      const tokenAmount = '0.1'
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate wallet field', () => {
      const walletAddress = '0x0000000000000000000000000000000000000000'
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .type(walletAddress)
        .should('have.value', walletAddress)
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - handle an error', () => {
      cy.get('div.el-dialog').eq(0)
        .find('.el-form-item__content > .el-button')
        .click()
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - correct', () => {
      const tokenAmount = '0.1'
      const walletAddress = '0x0000000000000000000000000000000000000000'
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .type(walletAddress)
        .should('have.value', walletAddress)
      cy.get('div.el-dialog').eq(0)
        .find('.el-form-item__content > .el-button')
        .click()
      cy.get('div.el-dialog').eq(0)
        .get('div.el-dialog')
        .eq(4)
        .should('be.visible')
      cy.get('div.el-dialog').eq(0)
        .get('i.el-dialog__close')
        .eq(4)
        .click()
    })

    it('Close modal', () => {
      cy.get('i.el-dialog__close').eq(0).click()
      cy.get('div.el-dialog').eq(0).should('not.be.visible')
    })
  })

  describe('Test transfer modal', () => {
    it('Open modal', () => {
      cy.get('[data-cy=transfer]').click()
      cy.get('div.el-dialog').eq(2).should('be.visible')
    })

    it('Validate amount field', () => {
      const tokenAmount = '0.1'
      cy.get('div.el-dialog').eq(2)
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('div.el-dialog').eq(2)
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('div.el-dialog').eq(2)
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('div.el-dialog').eq(2)
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate account field', () => {
      const account = 'james@bond'
      cy.get('div.el-dialog').eq(2)
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .type(account)
        .should('have.value', account)
      cy.get('div.el-dialog').eq(2)
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('div.el-dialog').eq(2)
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('div.el-dialog').eq(2)
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - handle an error', () => {
      cy.get('div.el-dialog').eq(2)
        .find('.el-dialog__body > .el-button')
        .click()
      cy.get('div.el-dialog').eq(2)
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
      cy.get('div.el-dialog').eq(2)
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - correct', () => {
      const tokenAmount = '0.1'
      const account = 'james@bond'
      cy.get('div.el-dialog').eq(2)
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('div.el-dialog').eq(2)
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .type(account)
        .should('have.value', account)
      cy.get('div.el-dialog').eq(2)
        .find('.el-dialog__body > .el-button')
        .click()
      cy.get('div.el-dialog').eq(4).should('be.visible')
      cy.get('i.el-dialog__close').eq(4).click()
    })

    it('Close modal', () => {
      cy.get('div.el-dialog').eq(2)
        .find('i.el-dialog__close')
        .click()
      cy.get('div.el-dialog').eq(2)
        .find('div.el-dialog')
        .should('not.be.visible')
    })
  })

  describe('Test exchange modal', () => {
    it('Open modal', () => {
      cy.get('[data-cy=exchange]').click()
      cy.get('div.el-dialog').eq(3).should('be.visible')
    })

    it('Validate first amount field', () => {
      const tokenAmount = '0.1'
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate second amount field', () => {
      const tokenAmount = '0.2'
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Select second token', () => {
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(3) > .el-form-item__content > .el-input-group > .el-input-group__append > .el-select > .el-input > .el-input__inner')
        .click()
      cy.get('.el-scrollbar > .el-select-dropdown__wrap > .el-scrollbar__view')
        .find(':nth-child(4) > span').eq(1)
        .click()
      cy.get('div.el-dialog').eq(3)
        .find('.el-dialog__body > .el-form > :nth-child(4)')
        .should('be.visible')
    })

    it('Validate account field', () => {
      const account = 'james@bond'
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(5) > .el-form-item__content > .el-input > .el-input__inner')
        .type(account)
        .should('have.value', account)
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(5) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(5) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(5) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - handle an error', () => {
      cy.get('div.el-dialog').eq(3)
        .find('.el-dialog__body > .el-button')
        .click()
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(5) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - correct', () => {
      const tokenAmountFirst = '0.1'
      const tokenAmountSecond = '0.2'
      const account = 'james@bond'
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmountFirst)
        .should('have.value', tokenAmountFirst)
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmountSecond)
        .should('have.value', tokenAmountSecond)
      cy.get('div.el-dialog').eq(3)
        .find(':nth-child(5) > .el-form-item__content > .el-input > .el-input__inner')
        .type(account)
        .should('have.value', account)
      cy.get('div.el-dialog').eq(3)
        .find('.el-dialog__body > .el-button')
        .click()
      cy.get('div.el-dialog').eq(4).should('be.visible')
      cy.get('i.el-dialog__close').eq(4).click()
    })

    it('Close modal', () => {
      cy.get('i.el-dialog__close').eq(3).click()
      cy.get('div.el-dialog').eq(3).should('not.be.visible')
    })
  })
})

describe('Test wallets page with white list', () => {
  before(() => {
    cy.server()
    cy.route('GET', '/data/histoday*limit=30', 'fixture:crypto-api/histoday30.json')
    cy.route('GET', '/data/histoday*limit=365', 'fixture:crypto-api/histoday365.json').as('getHistoday365')
  })

  it('Make auth', () => {
    cy.visit('/')
    cy.login(testKeyPath)
    cy.wait('@getHistoday365')
  })

  it('Go to wallets page', () => {
    cy.get('li.el-menu-item:nth-of-type(2)').click({ force: true })
    cy.url().should('contain', 'wallets/')
  })

  describe('Test withdraw modal', () => {
    it('Open modal', () => {
      cy.contains('Withdraw').click()
      cy.get('div.el-dialog').eq(0).should('be.visible')
    })

    it('Validate amount field', () => {
      const tokenAmount = '0.1'
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('not.be.visible')
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .clear()
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - handle an error', () => {
      cy.get('div.el-dialog').eq(0)
        .find('.el-form-item__content > .el-button')
        .click()
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(1) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(3) > .el-form-item__content > .el-form-item__error')
        .should('be.visible')
    })

    it('Validate modal - correct', () => {
      const tokenAmount = '0.1'
      cy.get('div.el-dialog').eq(0)
        .find(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get('div.el-dialog').eq(0)
        .find('.el-select > .el-input > .el-input__inner')
        .click()
      cy.get('.el-select-dropdown__item')
        .click()
      cy.get('div.el-dialog').eq(0)
        .find('.el-form-item__content > .el-button')
        .click()
      cy.get('div.el-dialog').eq(0)
        .get('div.el-dialog')
        .eq(4)
        .should('be.visible')
      cy.get('div.el-dialog').eq(0)
        .get('i.el-dialog__close')
        .eq(4)
        .click()
    })

    it('Close modal', () => {
      cy.get('i.el-dialog__close').eq(0).click()
      cy.get('div.el-dialog').eq(0).should('not.be.visible')
    })
  })
})
