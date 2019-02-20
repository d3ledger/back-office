import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { library } from '@fortawesome/fontawesome-svg-core'

import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine'
import { faWallet } from '@fortawesome/free-solid-svg-icons/faWallet'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons/faFileInvoice'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons/faExchangeAlt'
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons/faAngleDoubleDown'
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons/faAngleDoubleUp'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload'
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faSortAlphaUp } from '@fortawesome/free-solid-svg-icons/faSortAlphaUp'
import { faSortAlphaDown } from '@fortawesome/free-solid-svg-icons/faSortAlphaDown'
import { faSortNumericUp } from '@fortawesome/free-solid-svg-icons/faSortNumericUp'
import { faSortNumericDown } from '@fortawesome/free-solid-svg-icons/faSortNumericDown'
import { faSortAmountUp } from '@fortawesome/free-solid-svg-icons/faSortAmountUp'
import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons/faSortAmountDown'
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons/faFileExcel'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  Dialog,
  Menu,
  MenuItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  DatePicker,
  Form,
  FormItem,
  Tag,
  Row,
  Col,
  Upload,
  Card,
  Container,
  Header,
  Aside,
  Main,
  Loading,
  Message,
  MessageBox,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Tooltip,
  Switch,
  Badge,
  Pagination
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import 'cryptocoins-icons/webfont/cryptocoins.css'

import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/candlestick'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/dataZoom'

import VueClipboard from 'vue-clipboard2'

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

Vue.component('ECharts', ECharts)

Vue.use(Dialog)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tag)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Badge)
Vue.use(Pagination)
Vue.use(Loading.directive)
const MsgBox = MessageBox
Vue.prototype.$prompt = MsgBox.prompt
Vue.prototype.$alert = MsgBox.alert
Vue.prototype.$message = Message
locale.use(lang)

library.add(
  faCog,
  faChartLine,
  faWallet,
  faSignOutAlt,
  faFileInvoice,
  faExchangeAlt,
  faAngleDoubleDown,
  faAngleDoubleUp,
  faAngleRight,
  faAngleDown,
  faArrowRight,
  faDownload,
  faUpload,
  faClock,
  faSearch,
  faSortAlphaUp,
  faSortAlphaDown,
  faSortNumericUp,
  faSortNumericDown,
  faSortAmountUp,
  faSortAmountDown,
  faFile,
  faFileExcel,
  faFilePdf,
  faPlus,
  faPencilAlt,
  faTrashAlt
)
Vue.component('fa-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
