const webpack = require("webpack")
const path = require("path")
const { merge } = require("webpack-merge")
const base = require("./webpack.base.config")
module.exports = merge(base, {
  devtool: "inline-source-map",
  devServer: {
    open: true,
    port: 9876,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
})
