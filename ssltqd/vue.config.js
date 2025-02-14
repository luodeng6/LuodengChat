const { defineConfig } = require('@vue/cli-service')
//导入webpack
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',

  // 手动更新webpack配置以确保正确引入gsap

  /*配置代理 开发环境下可以！*/
  devServer: {
    proxy:'http://localhost:84/' // 后端接口地
  },

  /*configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      }),

    ]
  }*/

})
