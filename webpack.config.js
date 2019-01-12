const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const extension = (path) => `./src/extension/${path}`;

module.exports = {
  mode: 'development',
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
