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

const entrys = {}
const htmls = glob.sync("src/views/**/*.html")
console.log(htmls, "1234")
let HtmlPlugins = []
htmls.forEach((html) => {
  let htmlPath = html.split("/")
  let file = htmlPath.pop()
  let jsName = file.split(".")[0]
  let moduleName = htmlPath[htmlPath.length - 1]
  entrys[moduleName + "/" + moduleName + "_" + jsName] = path.resolve(
    __dirname,
    "../src/views/" + moduleName + "/js/" + jsName + ".js"
  )
  let htmlConfig = {
    filename: "views/" + moduleName + "/" + file,
    template: path.resolve(
      __dirname,
      "../src/views/" + moduleName + "/" + file
    ),
    showErrors: true,
    inject: "body",
    chunks: [moduleName + "/" + moduleName + "_" + jsName],
    hash: true,
    cache: true,
  }
  let htmlPlugin = new HtmlWebpackPlugin(htmlConfig)
  HtmlPlugins.push(htmlPlugin)
})
entrys["index"] = resolve("/src/index.js")

console.log(entrys, "entrys")
console.log(HtmlPlugins, "HtmlPlugins")

const base = {
  context: path.resolve(__dirname, "../"),
  entry: entrys,
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
    ...HtmlPlugins,
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: resolve("/src/index.html"),
      showErrors: true,
      inject: "body",
      chunks: ["index"],
      hash: true,
      cache: true,
    }),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.join(__dirname, "..", "/src/views/test/"),
    //       to: path.join(__dirname, "..", "dist/views"),
    //       toType: "dir",
    //     },
    //   ],
    // }),
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
      paths: glob.sync(path.join(__dirname, "src/views/**/*.html")),
    }),
  ],
  externals: {},
}

module.exports = base
