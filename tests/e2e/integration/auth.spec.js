const testKeyPath = 'test@notary.priv'

describe('Test login page', () => {
  it('Log in', () => {
    cy.visit('/')
    cy.login(testKeyPath)
  })

  it('Log out', () => {
    cy.get('.el-side-menu .el-menu-item:contains("Logout")').click({ force: true })
    cy.contains('Login').should('be.visible')
  })
})

describe('Test register page', () => {
  it('Click sign up button', () => {
    cy.contains('Sign Up').click()
    cy.contains('Sign Up').should('be.visible')
  })

  // Signing up should fail because the registration service doesn't work on CI now
  it('Register new user - failure', () => {
    cy.get('.el-input__inner[name="username"]').type('jasonstatham')
      .should('have.value', 'jasonstatham')
    cy.get('.el-input__inner[name="newAddress"]').type('0x070f9d09370fd7ae3a583fc22a4e9f50ae1bdc78')
      .should('have.value', '0x070f9d09370fd7ae3a583fc22a4e9f50ae1bdc78')
    cy.get('.el-form-item__content > .el-button').contains('ADD').click()
    cy.get('.el-form-item__content > .el-button.fullwidth').click()
    cy.get('.el-message-box__title:contains("Sign up error")').should('be.visible')
  })

  it.skip('Confirm should redirect to Log in', () => {
    cy.contains('Confirm').click()
    cy.url().should('be.eq', `${Cypress.config('baseUrl')}/#/login`)
  })
})
