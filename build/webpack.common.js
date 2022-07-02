const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const PATHS = require("./paths");
const bebelConfig = require("./babel.config");
const pkg = require("../package.json");

// Set Environment
const NODE_ENV = process.env.NODE_ENV || "development";

const isEnvDevelopment = NODE_ENV === "development";
const isEnvProduction = NODE_ENV === "production";

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isEnvDevelopment && "style-loader",
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: "css-loader",
      options: cssOptions,
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          ident: "postcss",
          config: false,
          plugins: [
            "postcss-flexbugs-fixes",
            [
              "postcss-preset-env",
              {
                autoprefixer: {
                  flexbox: "no-2009",
                },
                stage: 3,
              },
            ],
            "postcss-normalize",
          ],
        },
        sourceMap: isEnvDevelopment,
      },
    },
  ].filter(Boolean);

  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: true,
      },
    });
  }

  return loaders;
};

module.exports = {
  devtool: false,
  entry: {
    "newtab/index": `${PATHS.SRC_DIR}/newtab.index.tsx`,
    background: `${PATHS.SRC_DIR}/background/index.ts`,
  },
  output: {
    publicPath: "/",
  },
  cache: {
    type: "filesystem",
    store: "pack",
  },
  stats: {
    children: false,
    colors: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: PATHS.SRC_DIR,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          babelrc: false,
          configFile: false,
          cacheDirectory: true,
          cacheCompression: false,
          ...bebelConfig({ isEnvDevelopment }),
        },
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
      {
        test: /\.(css)$/,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: isEnvDevelopment,
          modules: {
            mode: "icss",
          },
        }),
        sideEffects: true,
      },
      {
        test: /\.(scss|sass)$/,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            sourceMap: isEnvDevelopment,
            modules: {
              mode: "icss",
            },
          },
          "sass-loader",
        ),
        sideEffects: true,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    alias: {
      components: PATHS.COMPONENTS,
      utils: PATHS.UTILS,
      src: PATHS.SRC_DIR,
      pages: PATHS.PAGES,
      services: PATHS.SERVICES,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      PACKAGE_VERSION: JSON.stringify(pkg.version),
    }),
    new InterpolateHtmlPlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      PACKAGE_VERSION: JSON.stringify(pkg.version),
    }),
    new ESLintPlugin({
      extensions: ["js", "ts", "tsx"],
    }),
  ],
};
