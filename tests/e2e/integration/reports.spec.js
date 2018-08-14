import { URL } from '../config'
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns'

const testKeyPath = 'test@notary.priv'

describe('Reports page', () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const previousMonth = subMonths(Date.now(), 1)
  const startOfPreviousMonth = format(startOfMonth(previousMonth), 'YYYYMMDD')
  const endOfPreviousMonth = format(endOfMonth(previousMonth), 'YYYYMMDD')
  const dateFrom = '2018-01-01'
  const dateTo = '2018-03-31'

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
    cy.get('#reports-page .el-dialog .el-dialog__header').contains('Report')
  })

  it('fills the form', () => {
    cy.get('#reports-page .el-dialog input#wallet-selector').click()
    cy.get('.el-select-dropdown .el-select-dropdown__item:contains("Monaco")').click({ force: true })
    cy.get('#reports-page .el-dialog input[placeholder="Start date"]').type(format(dateFrom, 'YYYY-MM-DD'), { force: true })
    cy.get('#reports-page .el-dialog input[placeholder="End date"]').type(format(dateTo, 'YYYY-MM-DD'), { force: true }).blur()
  })

  it('should download the new report as PDF', () => {
    const stub = cy.stub()
    const expectedFilename = `report-monaco-${format(dateFrom, 'YYYYMMDD')}-${format(dateTo, 'YYYYMMDD')}.pdf`

    cy.on('window:alert', stub)
    cy.get('#reports-page .el-dialog button:contains("PDF")')
      .click({ force: true })
      .should(() => expect(stub.called).to.be.true)
      .then(() => expect(stub.getCall(0)).to.be.calledWith(`downloading ${expectedFilename}`))
  })

  it('should download the new report as CSV', () => {
    const stub = cy.stub()
    const expectedFilename = `report-monaco-${format(dateFrom, 'YYYYMMDD')}-${format(dateTo, 'YYYYMMDD')}.csv`

    cy.on('window:alert', stub)
    cy.get('#reports-page .el-dialog button:contains("CSV")')
      .click({ force: true })
      .should(() => expect(stub.called).to.be.true)
      .then(() => expect(stub.getCall(0)).to.be.calledWith(`downloading ${expectedFilename}`))
  })
})
