'use strict'
require('babel-polyfill') // 为了axios兼容IE
const path = require('path')
const defaultSettings = require('./src/settings.js')

const fs = require('fs') //

function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = defaultSettings.title || '远程智能巡检系统' // 标题

const port = process.env.port || process.env.npm_config_port || 80 // 端口

const webpack = require('webpack') //

let dirsName = fs.readdirSync(resolve('node_modules')).filter(dirName => /el-table-editabled/.test(dirName)) //
const includesDirs = dirsName.map(dir => resolve(`node_modules/${dir}/src`)) //

// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
    transpileDependencies: [ //解决IE浏览器得es6转换成es5得问题（IE报错缺少':'）
        // /[/\\]node_modules[/\\]dom7[/\\]/,
        // /[/\\]node_modules[/\\]swiper[/\\]/,
        /[/\\]node_modules[/\\]element-ui[/\\]packages[/\\]/,
        /[/\\]node_modules[/\\]element-ui[/\\]src[/\\]/,
        /[/\\]node_modules[/\\]capital-ui[/\\]src[/\\]/,
        // /[/\\]node_modules[/\\]vux[/\\]/
    ],

    // 部署生产环境和开发环境下的URL。
    // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.psim.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.psim.vip/admin/，则设置 baseUrl 为 /admin/。
    publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
    // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
    outputDir: 'dist',
    // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
    assetsDir: 'static',
    // 是否开启eslint保存检测，有效值：ture | false | 'error'
    lintOnSave: process.env.NODE_ENV === 'development',
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,
    // webpack-dev-server 相关配置
    devServer: {
        host: '0.0.0.0',
        port: port,
        // proxy:'http://172.16.0.10:8080',
        proxy: {
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            [process.env.VUE_APP_BASE_API]: {
                target: `http://127.0.0.1:8080`, //生产环境 上传到服务器地址
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        },
        disableHostCheck: true
    },
    configureWebpack: {
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        // entry:['babel-polyfill','./src/main.js']
    },
    chainWebpack(config) {
        config.plugins.delete('preload') // TODO: need test
        config.plugins.delete('prefetch') // TODO: need test

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/assets/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        //修改为了解决IE兼容
        config.module
            .rule('babel')
            .test(/.js$/)
            .include.add(resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client'), resolve('node_modules/@jiaminghi/data-view'), ...includesDirs)
            .end()
            .use('babel-loader')
            .loader('babel-loader')
            .end()

        // set preserveWhitespace
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true
                return options
            })
            .end()

        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .plugin('ScriptExtHtmlWebpackPlugin')
                        .after('html')
                        .use('script-ext-html-webpack-plugin', [{
                            // `runtime` must same as runtimeChunk name. default is `runtime`
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
                                elementUI: {
                                    name: 'chunk-elementUI', // split elementUI into a single package
                                    priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                                    test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
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
                    config.optimization.runtimeChunk('single')
                }
            )
    }
}