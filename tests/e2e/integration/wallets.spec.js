const testKeyPath = 'test@notary.priv'

const TOKEN = 'BasicAttentionToken'

describe('Test wallets page', () => {
  it('Make auth', () => {
    cy.visit(Cypress.env('URL'))
    cy.login(testKeyPath)
    cy.server()
    cy.route('GET', '/data/histoday*limit=30', 'fixture:crypto-api/histoday30.json')
    cy.route('GET', '/data/histoday*limit=365', 'fixture:crypto-api/histoday365.json').as('getHistoday365')
    cy.wait('@getHistoday365')
  })

  it('Go to wallets page', () => {
    cy.get('li.el-menu-item:nth-of-type(2)').click({ force: true })
    cy.url().should('contain', 'wallets/')
  })

  it('Search for waller', () => {
    cy.get('.el-input__inner')
      .type(TOKEN).should('have.value', TOKEN)
    cy.get('aside').find('a.card').should('have.length', 1)
  })

  it('Open wallet', () => {
    cy.get('a.card').first().click()
    cy.url().should('contain', TOKEN.toLowerCase())
    cy.get('div.card-header').first().should('contain', TOKEN)
  })

  describe('Test deposit model', () => {
    it('Open model', () => {
      cy.contains('Deposit').click()
      cy.get('div.el-dialog').eq(1).should('be.visible')
    })

    it.skip('Wallet address expect to be valid', () => {})

    it.skip('QR Code value and address are equal', () => {
    })

    it('Close model', () => {
      cy.get('i.el-dialog__close').eq(1).click()
      cy.get('div.el-dialog').eq(1).should('not.be.visible')
    })
  })

  describe('Test withdraw model', () => {
    it('Open model', () => {
      cy.contains('Withdraw').click()
      cy.get('div.el-dialog').eq(0).should('be.visible')
    })

    it('Validate amount field', () => {
      const tokenAmount = '123'
      cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner').type(tokenAmount)
        .should('have.value', tokenAmount)
      // TODO: Not implemented due to PR-27 not merged to develop
      // expect('NOT IMPLEMENTED').to.be.equal('Error should be visible if value incorrected')
      // expect('NOT IMPLEMENTED').to.be.equal('Error should not be visible if value corrected')
    })

    it('Validate wallet field', () => {
      const walletAddress = '123'
      cy.get(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner').type(walletAddress)
        .should('have.value', walletAddress)
      // TODO: Not implemented due to PR-27 not merged to develop
      // expect('NOT IMPLEMENTED').to.be.equal('Error should be visible if value incorrected')
      // expect('NOT IMPLEMENTED').to.be.equal('Error should not be visible if value corrected')
    })

    it('Validate modal - handle an error', () => {
      cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner').clear()
      cy.get(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner').clear()
      // TODO: Not implemented due to PR-27 not merged to develop
      // cy.get('.el-form-item__content > .el-button').click()
      // cy.get('div.el-dialog').eq(4).should('not.be.visible')
      // cy.get('i.el-dialog__close').eq(4).click()
    })

    it('Validate modal - correct', () => {
      const tokenAmount = '123'
      const walletAddress = '123'
      cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner').type(tokenAmount)
        .should('have.value', tokenAmount)
      cy.get(':nth-child(3) > .el-form-item__content > .el-input > .el-input__inner').type(walletAddress)
        .should('have.value', walletAddress)
      // TODO: Not implemented due to PR-27 not merged to develop
      // cy.get('.el-form-item__content > .el-button').click()
      // cy.get('div.el-dialog').eq(4).should('be.visible')
      // cy.get('i.el-dialog__close').eq(4).click()
    })

    it('Close model', () => {
      cy.get('i.el-dialog__close').eq(0).click()
      cy.get('div.el-dialog').eq(0).should('not.be.visible')
    })
  })

  describe('Test transfer model', () => {
    it('Open model', () => {
      cy.contains('Transfer').click()
      cy.get('div.el-dialog').eq(2).should('be.visible')
    })

    it('Close model', () => {
      cy.get('i.el-dialog__close').eq(2).click()
      cy.get('div.el-dialog').eq(2).should('not.be.visible')
    })
  })

  describe('Test exchange model', () => {
    it('Open model', () => {
      cy.contains('Exchange').click()
      cy.get('div.el-dialog').eq(3).should('be.visible')
    })

    it('Close model', () => {
      cy.get('i.el-dialog__close').eq(3).click()
      cy.get('div.el-dialog').eq(3).should('not.be.visible')
    })
  })
})
