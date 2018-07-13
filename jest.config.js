module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/{components,server,lib,pages}/**/*.?(!d.){ts,tsx}",
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  globals: {
    "ts-jest": {
      useBabelrc: true,
      enableTsDiagnostics: true,
    },
  },
  projects: [
    {
      snapshotSerializers: ["enzyme-to-json/serializer"],
      setupTestFrameworkScriptFile: "<rootDir>lib/setupTests.js",
      displayName: "test",
      transform: {
        // "^.+\\.jsx?$": "babel-jest",
        "^.+\\.tsx?$": "ts-jest",
      },
      testRegex: "/__tests__/.*\\.test\\.(jsx?|tsx?)$",
      moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
      testEnvironment: "jest-environment-jsdom-global",
    },
    {
      runner: "jest-runner-tslint",
      displayName: "lint",
      moduleFileExtensions: [
        "js",
        "jsx",
        "json",
        "ts",
        "tsx",
        "css",
        "less",
        "scss",
        "graphql",
        "md",
        "markdown",
      ],
      testMatch: ["<rootDir>/{components,server,lib,pages}/**/*.{ts,tsx}"],
    },
    {
      runner: "jest-runner-prettier",
      displayName: "prettier",
      moduleFileExtensions: [
        "js",
        "jsx",
        "json",
        "ts",
        "tsx",
        "css",
        "less",
        "scss",
        "graphql",
        "md",
        "markdown",
      ],
      testMatch: ["<rootDir>/{components,server,lib,pages}/**/*.{ts,tsx}"],
    },
  ],
};
