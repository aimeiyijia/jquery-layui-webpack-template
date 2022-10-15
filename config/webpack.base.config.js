const webpack = require("webpack")
const path = require("path")
const glob = require("glob")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const PurgeCSSPlugin = require("purgecss-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")

function resolve(dir) {
  return path.join(__dirname, "..", dir)
}

const base = {
  context: path.resolve(__dirname, "../"),
  entry: resolve("/src/main.js"),
  output: {
    filename: "js/[name].js",
    path: resolve("/dist"),
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".css", "scss"],
    alias: {
      "@": resolve("src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "css-hot-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: {
                removeComments: false,
                collapseWhitespace: false,
              },
            },
          },
        ],
      },
      // {
      //   test: require.resolve("../src/vendors/layui/layui.all.js"),
      //   loader: "exports-loader?window.layui!script-loader",
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: resolve("/src/index.html"),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "..", "/src/views/test/"),
          to:  path.join(__dirname, "..", "dist/views"),
          toType: "dir",
        },
      ],
    }),
    new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ["dist"] }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
    }),
    new MiniCssExtractPlugin({
      filename: "/css/[name].css",
      chunkFilename: "/css/[id].css",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(path.join(__dirname, "src/*/*.html")),
    }),
  ],
  externals: {},
}

module.exports = base
