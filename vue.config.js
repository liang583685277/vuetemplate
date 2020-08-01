const port = process.env.port || process.env.npm_config_port || 3000 // dev port

module.exports = {
  publicPath: './',//基础路径
  outputDir: 'dist',//输出文件目录
  assetsDir: 'static',//静态资源目录
  productionSourceMap: false,

  devServer: {
    open: true, // 启动后打开浏览器
    host: '0.0.0.0',
    port: 8081,
    https: false,
    hotOnly:true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: `http://127.0.0.1:${port}/mock`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }, // 设置代理
    // eslint-disable-next-line no-unused-vars
    before: app => {
    }
  },
}
