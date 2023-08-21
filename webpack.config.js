const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "./plugins/ignore-console-log-plugin.js",
              [
                "./plugins/find-endless-loop-plugin.js",
                {
                  loopLimit: 1000,
                },
              ],
            ],
          },
        },
        exclude: "/node_modules/",
      },
    ],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
