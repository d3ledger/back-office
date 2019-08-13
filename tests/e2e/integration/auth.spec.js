const testKeyPath = 'test@d3.priv'

describe('Test login page', () => {
  it('Log in', () => {
    cy.visit('/')
    cy.login(testKeyPath)
  })

  it('Log out', () => {
    cy.get('.el-side-menu .el-menu-item:contains("Logout")').click({ force: true })
    cy.contains('Log in to D3').should('be.visible')
  })
})

describe('Test register page', () => {
  it('Click sign up button', () => {
    cy.get('[data-cy=toRegisterPage]').click()
    cy.contains('Register in D3').should('be.visible')
  })

  // Signing up should fail because the registration service doesn't work on CI now
  it('Register new user - failure', () => {
    cy.get('.el-input__inner[name="username"]')
      .type('jasonstatham')
      .should('have.value', 'jasonstatham')
    cy.get('.el-input__inner[name="publicKey"]')
      .type('9c430dfe8c54b0a447e25f75121119ac3b649c1253bce8eeeeeeeeeeeeeeeeee')
      .should('have.value', '9c430dfe8c54b0a447e25f75121119ac3b649c1253bce8eeeeeeeeeeeeeeeeee')
    cy.get('[data-cy=register]').click()
  })

  it.skip('Confirm should redirect to Log in', () => {
    cy.contains('Confirm').click()
    cy.url().should('be.eq', `${Cypress.config('baseUrl')}/#/login`)
  })
})
