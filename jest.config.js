module.exports = {
    projects: [
      {
        displayName: 'test'
      },
      {
        runner: 'jest-runner-tslint',
        displayName: 'lint',
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
            "markdown"
        ],
        testMatch: [
            '<rootDir>/{server,lib,pages}/**/*.{ts,tsx}'
        ]
      },
      {
        runner: 'jest-runner-prettier',
        displayName: 'prettier',
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
            "markdown"
        ],
        testMatch: [
            '<rootDir>/{server,lib,pages}/**/*.{ts,tsx}'
        ]
      }
    ]
  }