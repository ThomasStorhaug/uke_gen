const path = require('path');

module.exports = {
  entry: './src/main.js',
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};