const testKeyPath = 'alice@d3.priv'

describe('Test settings page', () => {
  it('Make auth', () => {
    cy.visit('/')
    cy.login(testKeyPath)
  })

  it('Go to settings page', () => {
    cy.goToPage('settings', 'Settings')
  })

  it('Change settings', () => {
    cy.get(':nth-child(1) > .el-col > .el-radio-group > :nth-child(2)').click().should(() => {
      expect(localStorage.getItem('settings')).to.eq('{"view":{"fiat":"USD"}}')
    })
    cy.get(':nth-child(2) > .el-col > .el-radio-group > :nth-child(3)').click().should(() => {
      expect(localStorage.getItem('settings')).to.eq('{"view":{"fiat":"USD","crypto":"XRP"}}')
    })
    cy.get(':nth-child(1) > :nth-child(1) > .el-input__inner').type('Europe/Dublin')
    cy.contains('ul', 'Europe/Dublin').click().should(() => {
      expect(localStorage.getItem('settings')).to.eq('{"view":{"fiat":"USD","crypto":"XRP","timezone":"Europe/Dublin"}}')
    })
  })

  describe('Public keys', () => {
    let accountSignatories = 0

    it('Get current amount of public key', () => {
      cy.get('[data-cy="accountSignatories"]').children()
        .then($children => {
          accountSignatories = $children.length
        })
    })

    it('Add public key', () => {
      cy.wrap('9c430dfe8c54b0a447e25f75121119ac3b649c1253bce8420f245e4c104dccd1').as('validPrivateKey')
      cy.get('[data-cy="addPublicKey"]').click()
      cy.get('[data-cy="addPublicKeyDialog"]')
        .should('be.visible')
      cy.get('[data-cy="addPublicKeyDialog').find('.el-button').click()
      cy.get('#approval-dialog .el-input')
        .each(function ($el, index) {
          cy.wrap($el).find('.el-input__inner')
            .type(this.validPrivateKey)
            .should('have.value', this.validPrivateKey)
        })
      cy.get('#confirm-approval-form').click({ force: true })
    })

    it('Download private key', () => {
      cy.get('[data-cy="downloadPrivateKeyDialog"]', { timeout: 10000 })
        .should('be.visible')
      cy.get('[data-cy="buttonDownload"]')
        .click()
      cy.get('[data-cy="buttonConfirm"]')
        .click()
    })

    it('Check new public key', () => {
      cy.get('[data-cy="accountSignatories"]', { timeout: 5000 }).children()
        .then($children => {
          expect($children.length).eq(accountSignatories + 1)
        })
    })

    it.skip('Remove public key', () => {
      // TODO: This test should not pick main public key
      // const mainPublicKey = 'iJ9riB4zG+IUh9t33PMsX409XoBm540v6sQjn+kdQW8='
      let keyToRemove = 0
      cy.get('[data-cy="removeSignatory"]').eq(keyToRemove).click({ force: true })
      cy.get('[data-cy="removePublicKeyDialog"]')
        .find('.el-button')
        .click()
      cy.wrap('0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33').as('validPrivateKey')
      cy.get('#approval-dialog .el-input')
        .each(function ($el, index) {
          cy.wrap($el).find('.el-input__inner')
            .type(this.validPrivateKey)
            .should('have.value', this.validPrivateKey)
        })
      cy.get('#confirm-approval-form').click({ force: true })
    })

    it.skip('Handle success message', () => {
      cy.get('.el-message', { timeout: 10000 }).should('be.visible')
      cy.get('[data-cy="accountSignatories"]').children()
        .then($children => {
          expect($children.length).eq(accountSignatories)
        })
    })
  })
})
