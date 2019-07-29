const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const ENV = process.env.NODE_ENV;

const extension = (path) => `./src/extension/${path}`;

module.exports = {
  entry: {
    content: extension('content.tsx'),
    'popup/index': extension('popup/index.tsx'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.js',
    ],
  },
  plugins: [
    new CopyPlugin([
      {
        from: extension('manifest.json'),
        transform: (content) => {
          return Buffer.from(JSON.stringify({
            version: require('./package.json').version,
            ...JSON.parse(content.toString()),
          }));
        },
      },
      {
        from: extension('popup/index.html'),
        to: 'popup',
      },
      {
        from: extension('icon/*'),
        to: 'icon',
        flatten: true,
      }
    ]),
    new DefinePlugin({
      ENVIRONMENT: JSON.stringify(ENV),
    }),
  ],
};

module.exports.mode = ENV;

if (ENV === 'development') {
  module.exports.devtool = 'inline-source-map';
}
