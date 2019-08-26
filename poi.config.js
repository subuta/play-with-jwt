module.exports = {
  entry: 'client/index.js',

  devServer: {
    proxy: 'http://localhost:3001'
  }
}
