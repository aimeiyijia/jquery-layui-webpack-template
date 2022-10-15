const webpack = require("webpack")
const path = require("path")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const { merge } = require("webpack-merge")
const base = require("./webpack.base.config")
module.exports = merge(base, {
  plugins: [new UglifyJSPlugin()],
})
