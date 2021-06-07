const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path')

module.exports = {
    publicPath: './',
    devServer: {
        host: '0.0.0.0',
        port: 8888,
        open: true
    },

    // 打包时不生成.map文件 避免看到源码
    productionSourceMap: false,
    // 部署优化
    configureWebpack: {
        // 使用CDN
        // externals: {
        //     vue: 'Vue',
        //     'vue-i18n': 'VueI18n',
        //     axios: 'axios',
        //     'vue-router': 'VueRouter',
        //     vuex: 'Vuex',
        //     iview: 'iview',
        //     echarts: 'echarts',
        //     apexcharts: 'ApexCharts',
        //     'vue-apexcharts': 'VueApexCharts',
        //     xlsx: 'XLSX',
        //     dplayer: 'DPlayer',
        //     gitalk: 'Gitalk'
        // },
        // GZIP压缩
        plugins: [
            new CompressionPlugin({
                test: /\.js$|\.html$|\.css/, // 匹配文件
                threshold: 10240 // 对超过10k文件压缩
            })
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                'assets': path.resolve(__dirname, './src/assets'),
                'views': path.resolve(__dirname, './src/views')
            } // 别名配置
        }
    },

    pluginOptions: {
        // 'style-resources-loader': {
        //     preProcessor: 'less',
        //     patterns: [// 引入全局样式变量
        //         path.resolve(__dirname, "./src/styles/common.less"),
        //         path.resolve(__dirname, "./src/styles/variable/*.less"),
        //     ]
        // }
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true,
                // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
                modifyVars: {
                    // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
                    // 'hack': `true; @import "${path.resolve('./src/styles/theme.less')}";`
                },
            },
        }
    }
};
