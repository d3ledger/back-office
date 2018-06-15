const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'util': path.resolve(__dirname, 'src/util')
      }
    }
  }
}
