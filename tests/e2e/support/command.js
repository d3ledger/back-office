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
  cy.upload_file(keyPath, 'input.el-upload__input')
  cy.get('form > div:nth-child(3) input')
    .type(Cypress.env('IROHA')).should('have.value', Cypress.env('IROHA'))
  cy.get('.login-button-container > div > button').click()
  cy.url().should('be.not.eq', `${Cypress.config('baseUrl')}/#/login`)
})

Cypress.Commands.add('setTimezone', (timezone) => {
  cy.get('.el-side-menu .el-menu-item:contains("Settings")').click({ force: true })
  cy.get('#timezone_select').should('be.visible').type(timezone)
  cy.get('.el-select-dropdown .el-select-dropdown__list').contains(new RegExp(`^\\s*${timezone}\\s*$`)).click({ force: true }).should(() => {
    const view = JSON.parse(localStorage.getItem('settings')).view

    expect(view).to.have.property('timezone', timezone)
  })
})

/*
 * In test environment, clicking a download button opens an alert instead of
 * downloading a file so Cypress can detect window:alert event to verify that
 * the correct file will be downloaded.
 */
Cypress.Commands.add('shouldDownload', {
  prevSubject: true
}, (subject, expectedFilename) => {
  const stub = cy.stub()

  cy.on('window:alert', stub)
  cy.wrap(subject).should(() => expect(stub.called).to.be.true)
    .then(() => expect(stub.getCall(0)).to.be.calledWith(`downloading ${expectedFilename}`))
})
