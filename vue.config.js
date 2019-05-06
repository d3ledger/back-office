const path = require('path')
const { execSync } = require('child_process')

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
  chainWebpack: config => {
    config.resolve.alias
      .set('@util', path.resolve(__dirname, 'src/util'))
      .set('@router', path.resolve(__dirname, 'src/router.js'))
    config.plugin('define').tap(args => {
      args[0]['process.env.VUE_APP_COMMIT_HASH'] = JSON.stringify(execSync('git rev-parse HEAD').toString().trim())
      args[0]['process.env.VUE_APP_COMMIT_HASH_SHORT'] = JSON.stringify(execSync('git rev-parse --short HEAD').toString().trim())
      return args
    })
    return config
  },
  configureWebpack: {
    module: {
      rules: rules
    }
  }
}
