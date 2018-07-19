import map from 'lodash/fp/map'
import flatten from 'lodash/fp/flatten'
import sortedUniq from 'lodash/fp/sortedUniq'
import flow from 'lodash/fp/flow'
import tz from 'timezones.json'
import { format } from 'date-fns'

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
      return format(time, 'MMMM D, YYYY HH:mm:ss')
    },
    formatDateWith (date, formatString) {
      const timeZoneLabel = this.$store.getters.settingsView.timezone
      const time = convertTime(date, timeZoneLabel)
      return format(time, formatString)
    }
  },
  data () {
    return {
      timezones
    }
  }
}

export default dateFormat
