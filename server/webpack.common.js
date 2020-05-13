/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  entry: { main: path.resolve(__dirname, "src/index.ts") },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server-bundle.js",
    libraryTarget: "commonjs2",
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
};
