import { URL } from '../config'

const testKeyPath = 'test@notary.priv'

describe('Test login page', () => {
  it('Log in', () => {
    cy.visit(URL)
    cy.login(testKeyPath)
  })

  it('Log out', () => {
    cy.get('li.el-menu-item:nth-of-type(6)').click({ force: true })
    cy.contains('Login').should('be.visible')
  })
})

describe('Test register page', () => {
  it('Click sign up button', () => {
    cy.contains('Sign Up').click()
    cy.contains('Sign Up').should('be.visible')
  })

  it('Register new user', () => {
    cy.get('.el-input__inner').type('jasonstatham')
      .should('have.value', 'jasonstatham')
    cy.get('.el-form-item__content > .el-button').click()
    cy.contains('Download').should('be.visible')
    cy.contains('Confirm').should('be.disabled')
    cy.get('.dialog-footer > .black').click()
    cy.contains('Confirm').should('not.be.disabled')
  })

  it('Confirm should redirect to Log in', () => {
    cy.contains('Confirm').click()
    cy.url().should('be.eq', `${URL}/#/login`)
  })
})
