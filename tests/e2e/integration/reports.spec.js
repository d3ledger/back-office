/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns'

const testKeyPath = 'test@d3.priv'

describe('Reports page', () => {
  const previousMonth = subMonths(Date.now(), 1)
  const startOfPreviousMonth = format(startOfMonth(previousMonth), 'YYYYMMDD')
  const endOfPreviousMonth = format(endOfMonth(previousMonth), 'YYYYMMDD')
  const dateFrom = '2018-01-01'
  const dateTo = '2018-03-31'

  let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Replace 'UTC' with 'Etc/GMT' because timezone.json has only the latter.
  if (['Etc/UTC', 'UTC'].includes(timezone)) timezone = 'Etc/GMT'

  it('does login', () => {
    cy.visit('/')
    cy.login(testKeyPath)
  })

  it(`sets timezone to ${timezone}`, () => {
    cy.setTimezone(timezone)
  })

  it('goes to the reports page', () => {
    cy.goToPage('reports', 'Reports')
  })

  it('lists the previous month\'s reports', () => {
    const from = format(startOfMonth(previousMonth), 'MMM D, YYYY')
    const to = format(endOfMonth(previousMonth), 'MMM D, YYYY')
    const expectedDateRangeString = `${from} - ${to}`

    cy.get('#reports-page tbody tr').each($el => {
      cy.wrap($el).contains(expectedDateRangeString)
    })
  })

  it('should download a file when clicking a CSV button', () => {
    const expectedFilename = `report-augur-${startOfPreviousMonth}-${endOfPreviousMonth}.csv`
    cy.wait(1000)
    cy.get('#reports-page tr:contains("Augur") button:contains("CSV")')
      .click()
      .shouldDownloadCSV(expectedFilename, cy.stub())
  })

  it('should download a file when clicking a PDF button', () => {
    const expectedFilename = `report-golem-${startOfPreviousMonth}-${endOfPreviousMonth}.pdf`
    cy.wait(1000)
    cy.get('#reports-page tr:contains("Golem") button:contains("PDF")')
      .click()
      .shouldDownloadPDF(expectedFilename, cy.stub())
  })

  it('opens "New Report" dialog', () => {
    cy.get('#reports-page [data-cy=getReport]').click()
    cy.get('#reports-page .el-dialog .el-dialog__header').contains('Report')
  })

  it('fills the form', () => {
    cy.get('#reports-page .el-dialog input#wallet-selector').click()
    cy.get('.el-select-dropdown .el-select-dropdown__item:contains("Augur")').click({ force: true })
    cy.get('#reports-page .el-dialog input[placeholder="Start date"]').type(format(dateFrom, 'YYYY-MM-DD'), { force: true })
    cy.get('#reports-page .el-dialog input[placeholder="End date"]').type(format(dateTo, 'YYYY-MM-DD'), { force: true }).blur()
  })

  it('should download the new report as CSV', () => {
    const expectedFilename = `report-augur-${format(dateFrom, 'YYYYMMDD')}-${format(dateTo, 'YYYYMMDD')}.csv`
    cy.wait(1000)
    cy.get('#reports-page .el-dialog button:contains("CSV")')
      .click({ force: true })
      .shouldDownloadCSV(expectedFilename, cy.stub())
  })

  it('fills the form', () => {
    cy.get('#reports-page .el-dialog input#wallet-selector').click()
    cy.get('.el-select-dropdown .el-select-dropdown__item:contains("Golem")').click({ force: true })
    cy.get('#reports-page .el-dialog input[placeholder="Start date"]').type(format(dateFrom, 'YYYY-MM-DD'), { force: true })
    cy.get('#reports-page .el-dialog input[placeholder="End date"]').type(format(dateTo, 'YYYY-MM-DD'), { force: true }).blur()
  })

  it('should download the new report as PDF', () => {
    const expectedFilename = `report-golem-${format(dateFrom, 'YYYYMMDD')}-${format(dateTo, 'YYYYMMDD')}.pdf`
    cy.wait(1000)
    cy.get('#reports-page .el-dialog button:contains("PDF")')
      .click({ force: true })
      .shouldDownloadPDF(expectedFilename, cy.stub())
  })
})
