/*
 * @Author: your name
 * @Date: 2021-02-24 11:09:31
 * @LastEditTime: 2021-04-12 15:31:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /saas-tonggang/config/proxy.js
 */

export default {
  dev: {
    '/saasbench/v1/': {
      target: 'http://192.168.1.75:7009',      
      // target: 'http://testsaasadmin.tonggangfw.net',      
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};
