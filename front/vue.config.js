const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');  // prefetch 삭제, naver logout 관련
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
      })
      return definitions
    })
  },
  devServer: {
    // naver logout 관련
    port: 8080,
    proxy: {
      // proxy 요청을 보낼 api 시작 부분
      '^api': {
        target: 'http://localhost:8080',
        changeOrigin : true
      },
      '/oauth2.0':{
        target: 'https://nid.naver.com'
      }
    }
  }
})
