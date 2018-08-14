Cypress.Commands.add('upload_file', (fileName, selector) => {
  return cy.get(selector).then(subject => {
    return cy.fixture(fileName, 'base64')
      .then(Cypress.Blob.base64StringToBlob)
      .then(blob => {
        const el = subject[0]
        const testFile = new File([blob], fileName, { type: 'text' })
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(testFile)
        el.files = dataTransfer.files
        return subject
      })
  })
})

Cypress.Commands.add('login', (keyPath) => {
  cy.get('form > div:nth-child(1) input')
    .type('test@notary').should('have.value', 'test@notary')
  cy.upload_file(keyPath, 'input.el-upload__input')
  cy.get('form > div:nth-child(2) input')
    .should('have.value', '0f0ce16d2afbb8eca23c7d8c2724f0c257a800ee2bbd54688cec6b898e3f7e33')
  cy.get('form > div:nth-child(3) input')
    .type(Cypress.env('IROHA')).should('have.value', Cypress.env('IROHA'))
  cy.get('.login-button-container > div > button').click()
  cy.contains('D3').should('be.visible')
})

Cypress.Commands.add('setTimezone', (timezone) => {
  cy.get('.el-side-menu .el-menu-item:contains("Settings")').click({ force: true })
  cy.get('.time-zone_select .el-input__inner').should('be.visible').type(timezone)
  cy.get('.el-select-dropdown .el-select-dropdown__list').contains(timezone).click().should(() => {
    const view = JSON.parse(localStorage.getItem('settings')).view

    expect(view).to.have.property('timezone', timezone)
  })
})
