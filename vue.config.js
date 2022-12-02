const { defineConfig } = require('@vue/cli-service')
const isPro = process.env.NODE_ENV === 'master' || process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'state'

module.exports = defineConfig({
  publicPath: isPro ? '/warehouse/' : '/',
  transpileDependencies: true,
  devServer: {
    port: 5001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  chainWebpack: (config) => {
    config.output.filename('assets/js/[name].[hash].js').chunkFilename('assets/js/[name].[hash].js').end()
  },
})
