const path = require("path");

const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const common = require("./webpack.common");
const PATHS = require("./paths");

module.exports = ({ distPath } = {}) => {
  if (!distPath && process.env.DEV_FOR) {
    distPath = path.resolve(PATHS.DIST_DIR, process.env.DEV_FOR, "unpacked");
  }

  return merge(common, {
    mode: "production",
    bail: true,
    output: {
      path: distPath,
      filename: "[name].js",
    },
    performance: {
      hints: false,
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              warnings: false,
              drop_console: true,
            },
            mangle: {
              safari10: true,
            },
            output: {
              comments: false,
              // Emoji and regex is not minified properly using default
              ascii_only: true,
            },
          },
        }),
        new CssMinimizerPlugin({}),
      ],
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        ignoreOrder: true,
      }),
    ],
  });
};
