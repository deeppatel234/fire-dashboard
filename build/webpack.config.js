const path = require("path");

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const PATHS = require("./paths");

require("dotenv").config();

const pkg = require("../package.json");

module.exports = ({ mode, distPath } = {}) => {
  if (!distPath && process.env.DEV_FOR) {
    distPath = path.resolve(PATHS.DIST_DIR, process.env.DEV_FOR, "unpacked");
  }

  const isDevelopment = mode === "development";

  return {
    mode,
    devtool: isDevelopment ? "cheap-module-source-map" : false,
    entry: {
      "newtab/index": `${PATHS.SRC_DIR}/newtab.index.tsx`,
      background: `${PATHS.EXTENSION_DIR}/core/background.ts`,
    },
    output: {
      path: distPath,
      filename: "[name].js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          include: PATHS.SRC_DIR,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            configFile: path.resolve(__dirname, "..", "babel.config.js"),
          },
        },
        {
          test: /\.svg$/,
          loader: "svg-inline-loader",
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: { url: false },
            },
            "sass-loader",
          ],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      alias: {
        components: PATHS.COMPONENTS,
        utils: PATHS.UTILS,
        src: PATHS.SRC_DIR,
        pages: PATHS.PAGES,
      },
    },
    plugins: [
      new ESLintPlugin({
        extensions: [".ts", ".tsx", ".js"],
      }),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        PACKAGE_VERSION: JSON.stringify(pkg.version),
        FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
        FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
        FIREBASE_PROJECT_ID: JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
    ],
  };
};
