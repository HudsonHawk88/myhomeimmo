// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const isProduction = process.env.NODE_ENV == 'production';
const target = isProduction ? 'web' : 'browserslist';
require('dotenv').config();
const { EnvironmentPlugin } = require('webpack');
module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devtool: "source-map",
    plugins: [
      new EnvironmentPlugin({
        reachaptchaApiKey: process.env.REACT_APP_recaptchakey,
        reachaptchaSecretKey: process.env.REACT_APP_recaptchasecret
      })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        hot: true,
        // host: '192.168.2.182',
        host: '192.168.11.64',
        port: 3000,
        historyApiFallback: true,
        proxy: {
            '/api': {
              // target: 'https://myhomeimmo.hu/api',
              target: 'http://teszt.myhomeimmo.inftechsol.hu:8460/api',
              // onProxyReq: (proxyReq) => {
              //   if (proxyReq.getHeader('origin')) {
              //   proxyReq.setHeader('origin', 'http://192.168.11.64:3000')
              //   // proxyReq.setHeader('origin', 'http://192.168.2.182:3000')
              // }},
              pathRewrite: { '^/api': ''},
              changeOrigin: true,
              secure: false,
              // cookieDomainRewrite: 'http://192.168.11.64',
              // cookieDomainRewrite: 'http://192.168.2.182',
              withCredentials: true,
            }
        }
    },
    ignoreWarnings: [(warning) => true],
    target: target,
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react','@babel/preset-env']
                        }
                    },
                    "source-map-loader"
                ]
            },
            {
                test: /\.(scss|css)$/,
                use: [
                  "style-loader",
                  "css-loader",
                  {
                    loader: "sass-loader",
                    options: {
                      // Prefer `dart-sass`
                      implementation: require("sass"),
                      sassOptions: {
                        outputStyle: 'compressed'
                      }
                    },
                  }]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            }
        ],
    }
};
