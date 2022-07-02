const path = require("path");

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const common = require("./webpack.common.js");
const PATHS = require("./paths");

const PORT = parseInt(process.env.PORT, 10) || 8000;
const HOST = process.env.HOST || "0.0.0.0";

module.exports = ({ distPath } = {}) => {
  if (!distPath && process.env.DEV_FOR) {
    distPath = path.resolve(PATHS.DIST_DIR, process.env.DEV_FOR, "unpacked");
  }

  return merge(common, {
    mode: "development",
    output: {
      path: distPath,
      filename: "[name].js",
    },
    devServer: {
      port: PORT,
      host: HOST,
      client: {
        overlay: {
          errors: true,
          warnings: true,
        },
        progress: true,
      },
      compress: true,
      historyApiFallback: true,
      hot: true,
      open: true,
      devMiddleware: {
        writeToDisk: true,
      },
    },
    plugins: [
      new webpack.SourceMapDevToolPlugin({}),
      new ReactRefreshWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        ignoreOrder: true,
      }),
    ],
  });
};
