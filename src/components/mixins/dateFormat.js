import { format } from 'date-fns'

var dateFormat = {
  filters: {
    formatDate: date => format(date, 'MMM. D, HH:mm'),
    formatDateLong: date => format(date, 'MMMM D, YYYY HH:mm:ss')
  }
}

export default dateFormat
