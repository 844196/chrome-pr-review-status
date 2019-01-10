const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    background: './src/background.js',
    content: './src/content.js',
    'popup/index': './src/popup/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: [
      '.js',
    ],
  },
  plugins: [
    new CopyPlugin([
      {
        from: './src/manifest.json',
        transform: (content) => {
          return Buffer.from(JSON.stringify({
            version: require('./package.json').version,
            ...JSON.parse(content.toString()),
          }));
        },
      },
      {
        from: './src/popup/index.html',
        to: 'popup',
      },
    ]),
  ],
};
