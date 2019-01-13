const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ENV = process.env.NODE_ENV;

const extension = (path) => `./src/extension/${path}`;

module.exports = {
  entry: {
    background: extension('background.ts'),
    content: extension('content.ts'),
    'popup/index': extension('popup/index.ts'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts',
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
    ]),
  ],
};

module.exports.mode = ENV;

if (ENV === 'development') {
  module.exports.devtool = 'inline-source-map';
}
