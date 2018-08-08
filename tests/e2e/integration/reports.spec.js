import path from 'path'
import { URL } from '../config'

const testKeyPath = path.resolve('test@notary.priv')

describe('Reports page', () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  it('does login', () => {
    cy.visit(URL)
    cy.login(testKeyPath)
  })

  it(`sets timezone to ${timezone}`, () => {
    cy.setTimezone(timezone)
  })

  it('goes to the reports page', () => {
    cy.get('.el-side-menu .el-menu-item:contains("Reports")').click({ force: true })
    cy.get('#reports-page .el-card__header > div').contains('Reports')
  })

  it('should download a file when clicking a PDF button', () => {
    const stub = cy.stub()

    cy.on('window:alert', stub)

    cy.get('#reports-page tr:contains("Monaco") button:contains("PDF")')
      .click()
      .should(() => expect(stub.called).to.be.true)
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith('downloading report-monaco-20180701-20180731.pdf')
      })
  })
})
