const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    'bizMOB-core': './public/bizMOB/bizMOB-core.js',
    'bizMOB-core-web': './public/bizMOB/bizMOB-core-web.js',
    'bizMOB-locale': './public/bizMOB/bizMOB-locale.js',
    'bizMOB-polyfill': './public/bizMOB/bizMOB-polyfill.js',
    'bizMOB-xross4': './public/bizMOB/bizMOB-xross4.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/public'),
    filename: '[name].js',
    library: {
      name: 'bizMOB',
      type: 'umd',
    },
    globalObject: 'this',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
  },
  externals: {
    // 외부 라이브러리들을 번들에서 제외
    'crypto-js': 'CryptoJS',
    'forge': 'forge',
  },
};