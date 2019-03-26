/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const testKeyPath = 'test@d3.priv'

describe('Test login page', () => {
  it('Log in', () => {
    cy.visit('/')
    cy.login(testKeyPath)
  })

  it('Log out', () => {
    cy.get('.el-side-menu .el-menu-item:contains("Logout")').click({ force: true })
    cy.contains('Welcome to D3').should('be.visible')
  })
})

describe('Test register page', () => {
  it('Click sign up button', () => {
    cy.get('[data-cy=signup]').click()
    cy.get('[data-cy=signup]').should('be.visible')
  })

  // Signing up should fail because the registration service doesn't work on CI now
  it('Register new user - failure', () => {
    cy.get('.el-input__inner[name="username"]').type('jasonstatham')
      .should('have.value', 'jasonstatham')
    cy.get('.el-form-item__content > .el-button.fullwidth').click()
  })

  it.skip('Confirm should redirect to Log in', () => {
    cy.contains('Confirm').click()
    cy.url().should('be.eq', `${Cypress.config('baseUrl')}/#/login`)
  })
})
