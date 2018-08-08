import path from 'path'
import { URL } from '../config'
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns'

const testKeyPath = path.resolve('test@notary.priv')

describe('Reports page', () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const previousMonth = subMonths(Date.now(), 1)
  const startOfPreviousMonth = format(startOfMonth(previousMonth), 'YYYYMMDD')
  const endOfPreviousMonth = format(endOfMonth(previousMonth), 'YYYYMMDD')

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
    const expectedFilename = `report-monaco-${startOfPreviousMonth}-${endOfPreviousMonth}.pdf`

    cy.on('window:alert', stub)
    cy.get('#reports-page tr:contains("Monaco") button:contains("PDF")')
      .click()
      .should(() => expect(stub.called).to.be.true)
      .then(() => expect(stub.getCall(0)).to.be.calledWith(`downloading ${expectedFilename}`))
  })

  it('should download a file when clicking a CSV button', () => {
    const stub = cy.stub()
    const expectedFilename = `report-monaco-${startOfPreviousMonth}-${endOfPreviousMonth}.csv`

    cy.on('window:alert', stub)
    cy.get('#reports-page tr:contains("Monaco") button:contains("CSV")')
      .click()
      .should(() => expect(stub.called).to.be.true)
      .then(() => expect(stub.getCall(0)).to.be.calledWith(`downloading ${expectedFilename}`))
  })

  it('opens "New Report" dialog', () => {
    cy.get('#reports-page button:contains("New Report")').click()
    cy.get('#reports-page .el-dialog__header').contains('Reports')
  })

  it.skip('fills a date range', () => {
    // cy.get('#reports-page input[placeholder="Start date"]').click()
  })
})
