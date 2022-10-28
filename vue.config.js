'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}
const name = '典学' // 标题
const port = process.env.port || process.env.npm_config_port || 80 // 端口

// vue.config.js 配置说明 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        host: '0.0.0.0',
        port: port,
        open: true,
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: `http://zjh.dev.mycloudedu.net/api`,
                // target: `http://192.168.3.235:9090/`,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            },
        },
        disableHostCheck: true
    },
    configureWebpack: {
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
    chainWebpack(config) {
        config.plugins.delete('preload') // TODO: need test
        config.plugins.delete('prefetch') // TODO: need test
        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .plugin('ScriptExtHtmlWebpackPlugin')
                        .after('html')
                        .use('script-ext-html-webpack-plugin', [{
                            inline: /runtime\..*\.js$/
                        }])
                        .end()
                    config
                        .optimization.splitChunks({
                            chunks: 'all',
                            cacheGroups: {
                                libs: {
                                    name: 'chunk-libs',
                                    test: /[\\/]node_modules[\\/]/,
                                    priority: 10,
                                    chunks: 'initial' // only package third parties that are initially dependent
                                },
                                commons: {
                                    name: 'chunk-commons',
                                    test: resolve('src/components'), // can customize your rules
                                    minChunks: 3, //  minimum common number
                                    priority: 5,
                                    reuseExistingChunk: true
                                }
                            }
                        })
                    config.optimization.runtimeChunk('single'), {
                        from: path.resolve(__dirname, './public/robots.txt'), //防爬虫文件
                        to: './', //到根目录下
                    }
                }
            )
    }
}