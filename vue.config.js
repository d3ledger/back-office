const path = require('path')

const rules = []

if (process.env.NODE_ENV === 'test') {
  rules.push({
    test: /\.(js|ts)$/,
    include: path.resolve('src'),
    loader: 'istanbul-instrumenter-loader',
    query: {
      esModules: true
    }
  })
}

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'util': path.resolve(__dirname, 'src/util')
      }
    },
    module: {
      rules: rules
    }
  }
}
