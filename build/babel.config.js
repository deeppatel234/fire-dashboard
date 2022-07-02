module.exports = ({ isEnvDevelopment } = {}) => {
  return {
    plugins: [
      "@babel/plugin-syntax-dynamic-import",
      [
        "@babel/plugin-transform-runtime",
        {
          regenerator: true,
        },
      ],
      isEnvDevelopment && "react-refresh/babel",
    ].filter(Boolean),
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "current",
          },
        },
      ],
      "@babel/preset-react",
      "@babel/preset-typescript",
    ],
  };
};
