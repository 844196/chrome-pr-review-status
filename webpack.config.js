const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  mode: NODE_ENV,
  devtool: NODE_ENV === 'production' ? 'none' : 'inline-source-map',
  entry: {
    'content': path.join(__dirname, 'src', 'content.tsx'),
    'popup/app': path.join(__dirname, 'src', 'popup.tsx'),
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
        from: 'public',
      },
      {
        from: 'public/manifest.json',
        transform: (content) => {
          return Buffer.from(JSON.stringify({
            version: require('./package.json').version,
            ...JSON.parse(content.toString()),
          }));
        },
      }
    ]),
    new DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
    }),
  ],
};
