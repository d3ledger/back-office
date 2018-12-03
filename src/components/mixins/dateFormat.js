import map from 'lodash/fp/map'
import flatten from 'lodash/fp/flatten'
import sortedUniq from 'lodash/fp/sortedUniq'
import flow from 'lodash/fp/flow'
import tz from 'timezones.json'
import format from 'date-fns/format'
import differenceInMinutes from 'date-fns/difference_in_minutes'

const timezones = flow(map(t => t.utc), flatten, sortedUniq)(tz)

const offsetByZone = (zone) =>
  tz.find(t =>
    t.utc.find(region => region === zone))

const convertTime = (date, zone) => {
  const timeZone = offsetByZone(zone).offset
  const targetTime = new Date(date)
  const tzDifference = timeZone * 60 + targetTime.getTimezoneOffset()
  return new Date(targetTime.getTime() + tzDifference * 60 * 1000)
}

const dateFormat = {
  methods: {
    formatDate (date) {
      const timeZoneLabel = this.$store.getters.settingsView.timezone
      const time = convertTime(date, timeZoneLabel)
      return format(time, 'MMM. D, HH:mm')
    },
    formatDateLong (date) {
      const timeZoneLabel = this.$store.getters.settingsView.timezone
      const time = convertTime(date, timeZoneLabel)
      return format(time, 'MMM. D, YYYY HH:mm:ss')
    },
    formatDateWith (date, formatString) {
      const timeZoneLabel = this.$store.getters.settingsView.timezone
      const time = convertTime(date, timeZoneLabel)
      return format(time, formatString)
    },
    compareDates (laterDate, earlierDate) {
      const diff = differenceInMinutes(laterDate, earlierDate)
      const hours = ~~(diff / 60) // return the quotient from division
      const minutes = diff % 60
      const formatMin = String(minutes).length < 2 ? `0${minutes}` : minutes
      return `${hours}:${formatMin}`
    }
  },
  data () {
    return {
      timezones
    }
  }
}

export default dateFormat
