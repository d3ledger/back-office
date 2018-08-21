import chai from 'chai'
import reportUtilInjector from 'inject-loader!@util/report-util.js'
import { format as formatDateOriginal } from 'date-fns'

const expect = chai.expect

describe('report-util', () => {
  const { generateReportData } = reportUtilInjector({
    'pdfmake-lite/build/pdfmake.min': {}
  })

  describe('generateReportData', () => {
    const MOCK_REPORT = require('../fixtures/report.json')

    /**
     * Force to format a date as UTC+0 for testing.
     *
     *   e.g.
     *   formatDateWith(1534828440000, 'MMM. D, HH:mm') == 'Aug. 21, 05:14'
     *   formatDateWith('Aug. 21, 05:14', 'MMM. D, HH:mm') == 'Aug. 21, 05:14'
     *   formatDateWith('Aug. 1', 'MMM. D, HH:mm') == 'Aug. 1, 00:00'
     */
    const formatDateWith = function (date, formatString) {
      const isUnixTimestamp = Number.isFinite(date)
      const tzOffsetMilliseconds = new Date().getTimezoneOffset() * 60 * 1000

      // Once parse the passed date with the environment's timezone.
      const dateWithOffset = new Date(date)

      const superficialUnixTimestamp = isUnixTimestamp
        ? dateWithOffset.getTime() + tzOffsetMilliseconds
        : dateWithOffset.getTime()

      // Technically, it is not UTC because it includes a timezone offset,
      // but its date and time parts are superficially the same as UTC.
      //
      //   dateSuperficialUTC = Tue Aug 21 2018 13:49:53 GMT+0900 (GMT+09:00)
      //                        ^^^^^^^^^^^^^^^^^^^^^^^^
      //                        ^here is the same as UTC
      //
      const dateSuperficialUTC = new Date(superficialUnixTimestamp)

      return formatDateOriginal(dateSuperficialUTC, formatString)
    }
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
