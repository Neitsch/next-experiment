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
  testRegex: "/__tests__/.*\\.spec\\.(jsx?|tsx?)$",
  automock: true,
  clearMocks: true,
  unmockedModulePathPatterns: [
    "lodash",
    "enzyme",
    "enzyme-to-json",
    "enzyme-adapter-react-16",
    "jest-extended",
    "core-js",
    "@material-ui",
    "react-test-renderer",
    "react",
  ],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupTestFrameworkScriptFile: "<rootDir>lib/setupTests.js",
  transform: {
    // "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "jest-environment-jsdom-global",
  moduleNameMapper: {
    "^apollo-server-express$":
      "<rootDir>/__unit_mocks__/apollo-server-express.mock.ts",
    "^auth0-lock$": "<rootDir>/__unit_mocks__/auth0-lock.mock.ts",
    "^express$": "<rootDir>/__unit_mocks__/express.mock.ts",
    "^graphql$": "<rootDir>/__unit_mocks__/graphql.mock.ts",
    "^graphql-tag$": "<rootDir>/__unit_mocks__/graphql-tag.mock.ts",
    "^jwks-rsa$": "<rootDir>/__unit_mocks__/jwks-rsa.mock.ts",
    "^next$": "<rootDir>/__unit_mocks__/next.mock.ts",
    "^next/app$": "<rootDir>/__unit_mocks__/next.app.mock.ts",
    "^next/document$": "<rootDir>/__unit_mocks__/next.document.mock.ts",
    "^next-routes$": "<rootDir>/__unit_mocks__/next-routes.mock.ts",
    "^next-with-apollo$": "<rootDir>/__unit_mocks__/next-with-apollo.mock.ts",
    "^react-jss.lib.JssProvider$":
      "<rootDir>/__unit_mocks__/react-jss.lib.JssProvider.mock.ts",
    "^react-apollo$": "<rootDir>/__unit_mocks__/react-apollo.mock.ts",
    "^sshpk$": "<rootDir>/__unit_mocks__/sshpk.mock.ts",
    "^typeorm$": "<rootDir>/__unit_mocks__/typeorm.mock.ts",
  },
  roots: ["server/", "pages/", "lib/", "components/"],
};
