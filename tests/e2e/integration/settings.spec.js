const testKeyPath = 'test@notary.priv'

describe('Test settings page', () => {
  it('Make auth', () => {
    cy.visit('/')
    cy.login(testKeyPath)
  })

  it('Go to settings page', () => {
    cy.get('li.el-menu-item:nth-of-type(5)').click({ force: true })
    cy.get('.el-card__header > div').contains('Settings')
  })

  it('Change settings', () => {
    cy.get(':nth-child(1) > .el-col > .el-radio-group > :nth-child(2)').click().should(() => {
      expect(localStorage.getItem('settings')).to.eq('{"view":{"fiat":"USD"}}')
    })
    cy.get(':nth-child(2) > .el-col > .el-radio-group > :nth-child(3)').click().should(() => {
      expect(localStorage.getItem('settings')).to.eq('{"view":{"fiat":"USD","crypto":"XRP"}}')
    })
    cy.get('.el-input__inner').type('Europe/Dublin')
    cy.contains('ul', 'Europe/Dublin').click().should(() => {
      expect(localStorage.getItem('settings')).to.eq('{"view":{"fiat":"USD","crypto":"XRP","timezone":"Europe/Dublin"}}')
    })
  })
})
