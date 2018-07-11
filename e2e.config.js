module.exports = {
  collectCoverage: false,
  globals: {
    "ts-jest": {
      enableTsDiagnostics: true,
    },
  },
  displayName: "e2e",
  transform: {
    // "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "e2e/.*\\.test\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
