#### 项目webpack学习了解
```js
'use strict';
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    plugins: [
        'qunar'
    ],
    config: {
        exports: [
            './app/dynamic/entry/index.js',
            './app/dynamic/entry/index.scss',
            './app/dynamic/home/index.tsx'
        ],
        modifyWebpackConfig: function(baseConfig) {
            baseConfig.module.loaders = baseConfig.module.loaders.concat([
                {
                    test: /\.(ts|tsx|js|jsx)$/,
                    include: [
                        // __dirname 当前运行文件的绝对路径
                        // path.resolve从右向左解析,遇到第一个绝对路径时返回,最后没有遇到绝对路径,使用当前文件路径拼接
                        path.resolve(__dirname, 'src'),
                    ],
                    loader: require.resolve('babel-loader'),
                    // query参数？
                    query: {
                        presets: [
                            'babel-preset-es2015',
                            'babel-preset-react',
                            'babel-preset-stage-0'
                        ],
                        plugins: [
                            'transform-object-rest-spread',
                            'transform-class-properties',   // ?
                            'transform-decorators-legacy'   // ?
                        ]
                    }
                },
                {
                    test: /\.ts(x?)$/,
                    loader: require.resolve('ts-loader')
                }
            ]);

            baseConfig.entry = Object.assign(baseConfig.entry, {
                // 在导出entry基础上在将以下资源打包bundle.js
                'bundle.js': [
                    'react',
                    'react-dom',
                    'react-redux',
                    'fastclick',
                    'tslib',
                    'babel-polyfill'
                ]
            })

            baseConfig.postcss = function() {
                return [autoprefixer({
                    browsers: ['last 200 versions'],
                    grid: true
                })];
            }

            // 这里的配置什么作用？
            baseConfig.entryExtNames.js.push('.ts', '.tsx');
            // baseConfig.resolve.extensions.push('.ts', '.tsx');
            let extensions = baseConfig.resolve.extensions;
            baseConfig.resolve.extensions = ['.ts', '.tsx', ...extensions];


            switch (this.env) {
                case "local":
                    baseConfig.plugins = baseConfig.plugins.concat([
                        new webpack.optimize.CommonsChunkPlugin({
                            // 已默认提取规则将公共资源提取并覆盖前边的bundle.js文件
                            name: "bundle",
                            filename: "bundle.js"
                        }),
                    ]);
                    break;
                case "prd":
                    baseConfig.plugins = baseConfig.plugins.concat([
                        // 配置参数、作用：防止生成不同hash的文件增加，要先清空
                        new CleanWebpackPlugin(["prd", "ver"], {
                            root: __dirname,
                            verbose: true,
                            dry: false
                        }),
                        new webpack.DefinePlugin({
                            "process.env.NODE_ENV": JSON.stringify("production"),
                            "ENV": JSON.stringify("production")
                        }),
                        new webpack.optimize.CommonsChunkPlugin({
                            name: "bundle",
                            filename: "bundle@[chunkhash].js"
                        })
                    ]);
                    // baseConfig.output.prd
                    baseConfig.output.prd = Object.assign({}, baseConfig.output.prd, {
                        chunkFilename: "[name]@[chunkhash].js"
                    });
                    break;
            }

            baseConfig.resolve.alias = {
                '$lib': '/src/lib',
                'common': '/src/common',
                '@components': '/src/components'
            };

            return baseConfig;
        }
    },
    hook:{},
    commands: []
};

```
- webpack新版本加入mode: 'production|development' 其作用是代替上边的：
```js
new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify("production")
})
```

