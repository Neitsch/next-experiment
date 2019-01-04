const withTypescript = require("@zeit/next-typescript");
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([
  [withTypescript]
], {
  excludeFile: (str) => /.*(spec|test).(ts|tsx|js|jsx)/.test(str)
});
