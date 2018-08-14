import chai from 'chai'
import reportUtilInjector from 'inject-loader!@util/report-util.js'

const expect = chai.expect

describe('report-util', () => {
  const { generateReportData } = reportUtilInjector({
    'pdfmake-lite/build/pdfmake.min': {}
  })

  describe('generateReportData', () => {
    const MOCK_REPORT = require('../fixtures/report.json')
    const formatDateWith = require('date-fns').format
    const formatDate = (date) => formatDateWith(date, 'MMM. D, HH:mm')

    it('should throw an error against lack of parameters', () => {
      const invalidParams = {}

      expect(() => generateReportData(invalidParams)).to.throw()
    })

    it('should return the correct data', () => {
      const params = {
        formatDate,
        formatDateWith,
        ...MOCK_REPORT.params
      }
      const reportData = generateReportData(params)

      expect(reportData).to.deep.include(MOCK_REPORT.expected)
    })
  })
})
