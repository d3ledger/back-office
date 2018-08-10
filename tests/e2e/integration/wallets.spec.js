const testKeyPath = 'test@notary.priv'

describe('Test settings page', () => {
  it('Make auth', () => {
    cy.visit(Cypress.env('URL'))
    cy.login(testKeyPath)
  })

  it('Go to wallets page', () => {
    cy.get('li.el-menu-item:nth-of-type(2)').click({ force: true })
    // cy.url().should('contain', 'wallets/')
  })
})
