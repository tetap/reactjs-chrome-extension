const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const WebpackObfuscator = require("webpack-obfuscator");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new WebpackObfuscator(
      {
        rotateUnicodeArray: true,
      },
      []
    ),
  ],
});
